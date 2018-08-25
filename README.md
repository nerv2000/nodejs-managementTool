# node.js로 만든 운영툴 웹페이지 샘플

웹페이지 기본 적인 기능만 구현 해본것임다.

기능으로 보면 아래와 같이 정리 할 수 있을꺼 같습니다.

- 관리자 계정 로그인
- 관리자 계정 생성 
- 차트 표시
- 데이터 페이징 표시

node.js에서는 알아야 할것들은 다음과 같습니다

- express
- express-session
- session-file-store
- async
- crypto-js
- hbs ([handlebars](https://handlebarsjs.com/)) - html templete 라이브러리
- [startbootstrap-sb-admin](https://startbootstrap.com/template-overviews/sb-admin/) - bootstrap 대쉬보드 라이브러리
- 뭐 나머지는 생활코딩 강좌에서 배운거라 그것을 참고를..

바로 작동 하는것은 아니고 몇가지 설정이 필요합니다.

DB 세팅은 mysql를 이용합니다. mysql폴더에 있는거 이용 하시면 됩니다.

ManagementTool/config 폴더에 config.json5 파일 세팅이 필요 합니다

세팅 내용은 config.templates.json5 를 참고 하시면 됩니다.

게시물 페이징은 OKKY에 zepinos님이 올려주신 내용을 참고하여 만들었습니다. 

[OKKY - 페이징에 대한 이해](https://okky.kr/articles/tips?query=%ED%8E%98%EC%9D%B4%EC%A7%95%28Paging%29%EC%97%90+%EB%8C%80%ED%95%9C+%EC%9D%B4%ED%95%B4&sort=id&order=desc)

mysql 쿼리는 저장프로시저 버전, 그냥 쿼리 버전 2가지를 만들었는데..

mysql에서 저장프로시저 쓰는건 뭔가 거지 같네요... 

왜 mysql에서 저장프로시저 쓰지말라는지 알꺼 같다능...
