export const OAUTH_STATE_COOKIE_NAME = "google_oauth_state";

// 初めてログインされたときに、新規登録ページに飛ばして、必要な情報を入力させてから
// ユーザーを作成するために認可コードをcookieに入れて、新規登録エンドポイントでこれを検証してユーザーを作成したい。
// 認可コードをcookieに入れるのが少し怖いが、googleのclient secretがバレなければアクセストークンとは交換されないし大丈夫か？
// 危ないのは、新規登録される間にcookieが盗まれて、勝手に登録されてセッションが作られるっていうケースがあるけど、
// 認可コードにも有効期限があるし、そこまでリスク高くないんじゃないかな・・・
export const OAUTH_CODE_COOKIE_NAME = "code";
