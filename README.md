### 作者
戸高新也
### アプリ名
chaochat

#### コンセプト
Twitterで募集できる時間制限つきのチャットサービス

#### こだわったポイント
- チャットメッセージのUIやOGP画像などのデザインはシンプルかつカッコよくなるように調整を繰り返しました。
- スマートフォンから使った時にUXが損なわれないようにしました。

### 公開したアプリの URL
https://chaochat.net

## 開発環境
### 開発環境
VSCode

### 開発言語
React.js(typescript)

## 動作対象ブラウザ
- Chrome 
- Safari
- Firefox

## アプリケーション機能
- チャットのルームを作りtwitterでURLを公開することにより参加者を募集する。
- 時間制限を決める事ができる。
### 機能一覧
- チャット: データベースとしてはFirebaseのCloud Firestoreを用いている
- 時間制限: Cloud Functions For Firebase のトリガーにより Cloud Tasksで時間制限機能を決めている。
- ホスティング: Cloud FunctionsをNext.jsに乗せる事でSSRを行っている。

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
