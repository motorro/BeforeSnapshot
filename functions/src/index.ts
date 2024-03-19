import * as admin from "firebase-admin/app";
import {logger as fLogger, setGlobalOptions} from "firebase-functions/v2";
import {CallableOptions, CallableRequest, HttpsError, onCall as onCall2} from "firebase-functions/v2/https";
import {onTaskDispatched} from "firebase-functions/v2/tasks";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {firestore} from "firebase-admin";
import {Calculation, CalculationCommand} from "./calculation";

if (0 === admin.getApps().length) {
    admin.initializeApp();
    setGlobalOptions({maxInstances: 10});
}

import CollectionReference = firestore.CollectionReference;
import {FirebaseQueueTaskScheduler} from "./FirebaseQueueTaskScheduler";
import {getFunctions} from "firebase-admin/functions";

const location = "europe-west1";

const options: CallableOptions = {
    region: location,
    invoker: "public"
};

const CALCULATIONS = "calculations";
const db = firestore();
const calculations = db.collection(CALCULATIONS) as CollectionReference<Calculation>;
const scheduler = new FirebaseQueueTaskScheduler(getFunctions(), location);

async function ensureAuth<DATA, RES>(request: CallableRequest<DATA>, block: (uid: string, data: DATA) => Promise<RES>): Promise<RES> {
    const uid = request.auth?.uid;
    if (undefined === uid) {
        fLogger.debug("Unauthenticated");
        return Promise.reject<RES>(new HttpsError("unauthenticated", "Unauthenticated"));
    }
    return await block(uid, request.data);
}

interface CalculateRequest {
    readonly a: number
    readonly b: number
}

export const calculate = onCall2(options, async (request: CallableRequest<CalculateRequest>) => {
    return ensureAuth(request, async (uid, data) => {
        fLogger.debug(`Scheduling calculation of ${data.a} and ${data.b}`);
        await scheduler.schedule("calculator", {request: data, user: uid});
        return {status: true};
    });
});

export const calculator = onTaskDispatched<CalculationCommand>(
    {
        retryConfig: {
            maxAttempts: 1,
            minBackoffSeconds: 30
        },
        rateLimits: {
            maxConcurrentDispatches: 6
        },
        region: location
    },
    async (req) => {
        const maxRetries = await scheduler.getQueueMaxRetries("calculator");
        fLogger.debug(`Queue run ${req.retryCount} of ${maxRetries}`);
        const calculation = calculations.doc();
        await calculation.set({
            request: req.data.request,
            sum: req.data.request.a + req.data.request.b,
            user: req.data.user
        });
    }
);

exports.onCalcCreated = onDocumentCreated(
    {
        document: `${CALCULATIONS}/{calcId}`,
        region: location
    },
    async (event) => {
        fLogger.debug("Calculation created", JSON.stringify(event.document));
    }
);
