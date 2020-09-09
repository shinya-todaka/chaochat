import * as firebase from "@firebase/testing";
import FirestoreTestProvider from "../ruleHelper";

const testName = 'create-room-member'
const provider = new FirestoreTestProvider(testName)

describe('create-room', () => {
  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })

  afterEach(async () => {
    await provider.cleanup()
  })

  test('認証していないとroomをgetできない', async () => {
    const db = provider.getFirestoreWithAuth(undefined)
    const roomReference = db.collection('message/v1/rooms').doc()
    await firebase.assertFails(roomReference.set({}))
  })
})