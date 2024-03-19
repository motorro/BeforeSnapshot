# A digested project to reproduce bug 5000 of google-cloud-node

Original [issue](https://github.com/googleapis/google-cloud-node/issues/5000)

Steps to reproduce:

1. Create Firebase project
2. Add Auth
3. Add Firestore
4. Add Functions
5. Clone the repository
6. Deploy to firebase
7. Go to Firebase console
8. Go to Firestore
9. Create a document in `calculations` collection
10. Check logs for `onCalcCreated` function

![Error](/readme/error.png)

Error details 1:
```json
{
  "textPayload": "Error: Failed to decode protobuf and create a snapshot.\n    at entryFromArgs (/workspace/node_modules/firebase-functions/lib/logger/index.js:130:19)\n    at Object.error (/workspace/node_modules/firebase-functions/lib/logger/index.js:116:11)\n    at createSnapshotFromProtobuf (/workspace/node_modules/firebase-functions/lib/common/providers/firestore.js:61:16)\n    at createSnapshot (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:120:59)\n    at makeFirestoreEvent (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:157:15)\n    at func (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:223:32)\n    at /layers/google.nodejs.functions-framework/functions-framework/node_modules/@google-cloud/functions-framework/build/src/function_wrappers.js:113:25\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)",
  "insertId": "65f95a25000dc50fe2da027e",
  "resource": {
    "type": "cloud_run_revision",
    "labels": {
      "project_id": "beforesnapshot",
      "configuration_name": "oncalccreated",
      "location": "europe-west1",
      "service_name": "oncalccreated",
      "revision_name": "oncalccreated-00001-yuw"
    }
  },
  "timestamp": "2024-03-19T09:25:57.902415Z",
  "severity": "ERROR",
  "labels": {
    "goog-managed-by": "cloudfunctions",
    "instanceId": "00a22404dc8598ac5a41eb3f7e4946a6c5661385da54aa812f5f3bf2d9836c49fd097e52010914715a3445b971c94ca298c16e2660e090d79448d3ffbe8fa5378e"
  },
  "logName": "projects/beforesnapshot/logs/run.googleapis.com%2Fstderr",
  "receiveTimestamp": "2024-03-19T09:25:57.904980875Z",
  "errorGroups": [
    {
      "id": "CPTJ2fj3s5D8zwE"
    }
  ]
}
```

Error details 2:
```json
{
  "textPayload": "TypeError: Cannot read properties of undefined (reading 'cloud')\n    at Function.decode (/workspace/node_modules/firebase-functions/protos/compiledFirestore.js:1529:130)\n    at createSnapshotFromProtobuf (/workspace/node_modules/firebase-functions/lib/common/providers/firestore.js:57:52)\n    at createSnapshot (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:120:59)\n    at makeFirestoreEvent (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:157:15)\n    at func (/workspace/node_modules/firebase-functions/lib/v2/providers/firestore.js:223:32)",
  "insertId": "65f95a25000dc8e15bb59009",
  "resource": {
    "type": "cloud_run_revision",
    "labels": {
      "revision_name": "oncalccreated-00001-yuw",
      "location": "europe-west1",
      "service_name": "oncalccreated",
      "configuration_name": "oncalccreated",
      "project_id": "beforesnapshot"
    }
  },
  "timestamp": "2024-03-19T09:25:57.903393Z",
  "severity": "ERROR",
  "labels": {
    "goog-managed-by": "cloudfunctions",
    "instanceId": "00a22404dc8598ac5a41eb3f7e4946a6c5661385da54aa812f5f3bf2d9836c49fd097e52010914715a3445b971c94ca298c16e2660e090d79448d3ffbe8fa5378e"
  },
  "logName": "projects/beforesnapshot/logs/run.googleapis.com%2Fstderr",
  "receiveTimestamp": "2024-03-19T09:25:58.237111771Z",
  "errorGroups": [
    {
      "id": "CLm6psip5seiAQ"
    }
  ]
}
```