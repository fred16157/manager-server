# manager-server

도서 관리용 서버입니다. API 요청 수신, DB 관리 역할을 하고 있습니다.

# API

외부에서 서버의 DB에 접근하기 위해선 HTTP 프로토콜을 사용해 API를 거쳐야 합니다.

모든 API의 요청과 응답에는 JSON을 통해 데이터를 전달합니다.
기본적으로 API에 접근하기 위한 URL은 http://example.com/api/ 입니다.
검색을 제외한 API는 성공적으로 작업을 마쳤을 시 JSON 형식으로 result: 1을 보냅니다.

## /search/ - 검색

HTTP의 GET 메소드를 통해 호출할 수 있는 검색 API입니다. 검색 API는 제목으로 찾기, 저자로 찾기, ISBN으로 찾기를 사용할 수 있습니다.

URL의 뒤에 아무것도 추가하지 않으면 모든 데이터를 반환합니다.

책의 정보는 다음과 같이 구성되어 있습니다.
~~~
_id: String,    //데이터의 고유 번호, 수정할 수 없음
isbn: String,   //ISBN 코드
title: String,  //책 제목
author: String, //저자
publishedAt: String,  //출판일자
rentalLog: [{ rentalAt: String, returnAt: String, userId: String }],    //대출 기록
status: {type: Number, default: 1}, //대출상태 - 1이면 대출되지 않음, 0이면 누군가가 대출한 상태
imageUrl: String    //책 이미지 링크
tags: [String]  //태그
~~~

사용 예시: 
~~~
GET http://example.com/api/search/
~~~

### /search/title/ - 제목으로 찾기

책의 제목을 통해 검색하는 API입니다.

사용 예시:
~~~
GET http://example.com/api/search/title/책제목
~~~

### /search/author/ - 저자로 찾기

책의 저자를 통해 검색하는 API입니다.

사용 예시:
~~~
GET http://example.com/api/search/title/저자
~~~

### /search/tag/ - 태그로 찾기

책의 태그를 통해 검색하는 API입니다. 태그 사이에 ','를 넣어 여러 태그를 조건으로 전달할 수 있습니다.

사용 예시:
~~~
GET http://example.com/api/search/tag/태그1,태그2
~~~

### /search/isbn/ - ISBN으로 찾기

책의 ISBN을 통해 검색하는 API입니다. ISBN은 13자리 형식을 사용합니다.

사용 예시:
~~~
GET http://example.com/api/search/isbn/ISBN
~~~

## /books/ - 책의 정보를 수정

책의 정보를 수정할 수 있는 API입니다.

### /books/delete/ - 삭제

DELETE 메소드를 통해 책의 정보를 삭제합니다. 책을 찾기 위해선 책의 고유 ID값(_id)이 필요합니다.

사용 예시:
~~~
DELETE http://example.com/api/books/delete/id
~~~

### /books/update/ - 갱신

PUT 메소드를 통해 책의 정보를 갱신합니다. 갱신할 수 있는 데이터는 대출기록(rentalLog)과 대출상태(status)입니다. 책을 찾기 위해선 책의 고유 ID값(_id)이 필요하며, JSON 형식의 갱신할 정보가 요청의 BODY에 있어야 합니다.

사용 예시:
~~~
요청:
PUT http://example.com/api/books/update/id

body:
{
    "rentalLog": [  //추가할 대출 기록, 옵션
        {
            "rentalAt": "YYYY-MM-DD", //대출일자
            "returnAt": "YYYY-MM-DD", //대출기한
            "userId": "fred16157"     //대출한 사용자의 ID
        }
    ],
    "status": 0 //대출상태 - 1이면 대출되지 않음, 0이면 누군가가 대출한 상태, 필수
}
~~~

### /books/upload/ - 추가

POST 메소드를 통해 책의 정보를 추가합니다. 추가에 필요한 데이터는 ISBN(isbn), 제목(title), 저자(author), 출판일자(publishedAt), 사진의 URL(imageUrl)입니다.
JSON 형식의 추가할 정보가 요청의 BODY에 있어야 합니다.

사용 예시:
~~~
요청:
POST http://example.com/api/books/upload/

body:
{
    {
        "isbn": "ISBN",
        "title": "제목",
        "author": "저자",
        "publishedAt": "YYYY-MM-DD",    //출판일자
        "imageUrl": "이미지 URL"
        "tags: ["태그"];
    }
}
~~~