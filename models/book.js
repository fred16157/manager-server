var mongoose = require("mongoose");

var BookSchema = new mongoose.Schema({
    isbn: String,   //ISBN 코드
    title: String,  //책 제목
    author: String, //저자
    publishedAt: String,  //출판일자
    rentalLog: [{ rentalAt: String, returnAt: String, userId: String }],    //대출 기록
    status: {type: Number, default: 1}, //대출상태 - 1이면 대출되지 않음, 0이면 누군가가 대출한 상태
    imageUrl: String,    //책 이미지 링크
    tags: [String]  //태그
});

module.exports = mongoose.model('book', BookSchema);