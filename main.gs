 var mainLocation = "現在通っている校舎";
 var subLocation  = "振替希望校舎";
 var rescheduleDate  = "振替希望日";
 var absentDate   = "欠席日付";
 var familyName   = "生徒名（姓）";
 var firstName    = "生徒名（名）";
 var kanaName     = "生徒名（カタカナ）";
 var address      = "メールアドレス";
 var phoneNo      = "";

 var hashimoto = '橋本';
 var horinouchi = '堀之内';
 var sagamihara = '相模原';
 var tamasenta = '多摩センター';
 var minamiosawa = '南大沢';
 var nerima = '練馬';
 var hachiozi = '八王子';
 var sagamiono = '相模大野';
 //奇数週開講校舎
 var oddWeek = [hashimoto,tamasenta,nerima,hachiozi];
 //偶数週開講校舎
 var evenWeek = [horinouchi,sagamihara,minamiosawa];
 
 var resPerson = '名前';
 var noticeAddress = ['メールアドレス']; 
 var noticeBody = '【振替フォームに更新がありました。】\n'
                +'内容は下記になります。\n'
                + '↓は振替シートのURL\n';
 var url = 'スプレッドシートのURL';

function automail() {
 
 var title        = "【振替完了通知】"; 
 var body         = "";
 var header       = "";
 var footer       = "";
 var main         = "";
 var foreKnown    = "";
 var errMessage   = "";
 
 var mainLocationValue = "";
 var subLocationValue  = "";
 var rescheduleDateValue  = "";
 var absentDateValue   = "";
 var familyNameValue   = "";
 var firstNameValue    = "";
 var kanaNameValue     = "";
 var addressValue      = "";
  
 var stopFlg = false;
 var mainOkFlg = true;
 var checkDateBefore;
 var checkDateAfter;
 var checkDay;
 
 var sheet = SpreadsheetApp.getActiveSheet();
 var rows = sheet.getLastRow();
 var cols = sheet.getLastColumn();
 var rg = sheet.getDataRange();
 Logger.log("rows="+rows+" cols="+cols);
 
  for (var i = 2; i <= cols; i++ ) {
    var col_name = rg.getCell(1, i).getValue(); 
    var col_value = rg.getCell(rows, i).getValue(); 
    if ( col_name === mainLocation ) {
      mainLocationValue = col_value;
        setInfo(mainLocationValue);
    }
    if ( col_name === subLocation ) {
      subLocationValue = col_value;
    }
    if ( col_name === rescheduleDate ) {
        //振替希望日が欠席日より前かどうか判定するための値を取得する。
        //checkDateAfter = Utilities.formatDate( col_value, 'Asia/Tokyo', 'yyyyMMdd');
      rescheduleDateValue = Utilities.formatDate( col_value, 'Asia/Tokyo', 'M月d日');
        //土曜日を判定するための値を設定する。
        checkDay = new Date(col_value).getDay();
    }
    if ( col_name === absentDate ) {
        //振替希望日が欠席日より前かどうか判定するための値を取得する。
        //checkDateBefore = Utilities.formatDate( col_value, 'Asia/Tokyo', 'yyyyMMdd');
      absentDateValue = Utilities.formatDate( col_value, 'Asia/Tokyo', 'M月d日');
        //土曜日を判定するための値を設定する。
      　　　　checkDay = new Date(col_value).getDay();
    }
    if ( col_name === familyName ) {
      familyNameValue = col_value;
    }
    if ( col_name === firstName ) {
      firstNameValue = col_value;
    }
    if ( col_name === kanaName ) {
       kanaNameValue = col_value;
    }
    if ( col_name === address ) {
      addressValue = col_value;
    }
  }
//  if( checkDateAfter-checkDateBefore < 0){
// 　　  mainOkFlg = false;
//  }
  //if(checkSchoolBuilding(mainLocationValue,subLocationValue)){
  //  mainOkFlg = false;
  //}
  //if( hashimoto == subLocationValue && rescheduleDateValue == '2018/09/15'){
  //  stopFlg = ture;
  //}
  //振替可能チェック
  mainOkFlg = checkAbleDate(rescheduleDateValue, subLocationValue);
  if(mainLocationValue == subLocationValue){
    mainOkFlg = false;
  }
  //if (checkDay != '6'){
  //  mainOkFlg = false;
  //}
  
   header = "-------------------------------------------------------\n\n"
         + "こちらは自動返信用のメールアドレスになります。\n"
         + "ご連絡がある方は下記のアドレスからお願いします。\n"
         + "メールアドレス\n\n"
         + "-------------------------------------------------------\n\n"
         + familyNameValue + "様\n\n"
         + "いつもお世話になっております。\n"
         + "社名"+ mainLocationValue + "校"
         + " " + resPerson + "です。\n\n";
  
  if(mainOkFlg){
     body = absentDateValue + " " + mainLocationValue + "校から\n"
          +rescheduleDateValue + " " + subLocationValue + "校への\n"
          +"振替登録が完了いたしました。\n\n"
          +"それでは" + rescheduleDateValue +"に" + subLocationValue + "校でお待ちしております。\n\n"
          +"会場や時間の確認は下記URLよりお願い致します。\n"
          +"https://会社のHP.jp/\n\n";
  }
  else{
     body = "大変申し訳ございませんが、入力情報に誤りがございます。\n"
          + "現在通っている校舎と振替先校舎で同じ校舎を選択していないこと、\n"
          + "欠席日と振替日が土曜日になっていること、\n"
          + "またHP（会社のHP）より最新の開講日をご確認していただき、\n"
          + "下記URLより再度振替登録をお願い致します。\n"
          + "https://techroomjr.jp/furikae/\n\n"
          + "↓登録内容↓\n"
          + "現在通っている校舎：" + mainLocationValue + "\n"
          + "振替希望校舎：" + subLocationValue + "\n"
          + "振替希望日：" + rescheduleDateValue + "\n"
          + "欠席日付：" + absentDateValue + "\n"
          + "生徒名：" + familyNameValue + firstNameValue + "\n"
          + "生徒名（カタカナ）：" + kanaNameValue + "\n\n";
     title = '【Tech Roomジュニア振替登録失敗通知】';
  }
       footer = "以上　今後とも宜しくお願いいたします。\n"
       if (phoneNo != ""){
         + "TEL :" + phoneNo +"\n"
       }
        + "MAIL : メールアドレス";

  //テスト用
  //addressValue = 'メールアドレス';
 main = header
      + body
      + footer;
 GmailApp.sendEmail(addressValue,title,main);
 if(mainOkFlg){
    sheet.getRange(rows, 10).setValue('送信済');
 }
 else{
    sheet.getRange(rows, 10).setValue('登録内容ミス');
    }
  
 foreKnown = noticeBody
   　　　　　　　　　　+ url + '\n\n'
        + header
        + body
        + footer;
  for(i = 0 ; i<noticeAddress.length ; i++){
    var nAddress = noticeAddress[i];
      GmailApp.sendEmail(nAddress,title,foreKnown);
      //GmailApp.sendEmail(addressValue,title,foreKnown);
  }
}

function isNullOrempty(val){
    if(val !="" || val!= null || val != undefined){
    return true;
    }
    return false;
}

function checkSchoolBuilding(mainVal, subVal){
  var mainOddFlg = false;
  var subOddFlg = false;
  var mainEvenFlg = false;
  var subEvenFlg = false;
  for(i = 0; i<oddWeek.length; i++){
    if(mainVal == oddWeek[i]){
    mainOddFlg = true;
    }
    if(subVal == oddWeek[i]){
    subOddFlg = true;
    }
  }
  for(i = 0; i<evenWeek.length; i++){
    if(mainVal == evenWeek[i]){
    mainEvenFlg = true;
    }
    if(subVal == evenWeek[i]){
    subEvenFlg = true;
    }
  }
  if ((mainVal == evenWeek[1] && subVal == evenWeek[0]) || (mainVal == evenWeek[0] && subVal == evenWeek[1])){
    return false
  }
  if (mainOddFlg == true && subOddFlg == true){
    return true
  }
  if (mainEvenFlg == true && subEvenFlg == true){
    return true
  }
    return false;
}

function setInfo(locationName){
resPerson = '名前１';
  if(hashimoto == locationName){
    resPerson = '名前２';
    phoneNo      = "08041585030"
  }
  if(horinouchi == locationName || minamiosawa == locationName){
    resPerson = '名前３';
  }
  if(sagamihara == locationName){
    resPerson = '名前4';
  }
  if(tamasenta == locationName){
    resPerson = '名前5';
  }
  if(nerima == locationName){
    resPerson = '名前6';
  }
  if(hachiozi == locationName){
    resPerson = '名前7';
  }
  if(sagamiono == locationName){
    resPerson = '名前8';
  }
}
function checkAbleDate(date, schoolName){
  //振替可能チェック（回答）のデータ取得
  var ableDateFile = SpreadsheetApp.openById('1Qi1wPrwT4mahnu5vtvI-9ILQl5xRY4OG49dDGjvMmys');
  var ableDateSheet = ableDateFile.getSheetByName('振替可能チェック');
  var ableDateColumnVals = ableDateSheet.getRange('A:A').getValues(); 
  var ableDateListCount = ableDateColumnVals.filter(String).length;
  
  if(ableDateListCount<=1){
    return true;
  }

  //明細データ取得(low,col,low,col)→対象データを二次元配列に取得
  var ableData = ableDateSheet.getRange(1, 1, ableDateListCount, 3).getValues();
  for(var i = 1; i<ableDateListCount; i++){
  //引数の日付と形式を合わせる
    var Date = Utilities.formatDate( ableData[i][2], 'Asia/Tokyo', 'M月d日');
    if(schoolName==ableData[i][1]){
      if(date==Date){
      return false;
      }
    }
  }

  return true;

}
