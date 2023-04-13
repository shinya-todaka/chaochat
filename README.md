### 機能一覧
- チャット: データベースとしてはFirebaseのCloud Firestoreを用いている
- 時間制限: Cloud Functions For Firebase のトリガーにより Cloud Tasksで時間制限機能を決めている。
- ホスティング: Next.jsをCloud Functionsに乗せる事でSSRを行っている。

### 画面一覧
- ルーム作成画面 ：チャットルームを作成する
- チャットルーム画面：ルーム内のメンバーとチャットできる。

### 使用しているAPI,SDK,ライブラリなど
- React.js
- Next.js
- material-ui
- jest (firestoreのルールのテスト用)
- canvas (OGP画像生成)
- prettier
- eslint 
- Cloud Firestore
- Cloud Functions For Firebase 
- Cloud Tasks 
