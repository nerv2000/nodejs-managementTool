'use strict'
const async = require('async');

module.exports = {
  /**
   * @description : 게시판 표시용 페이징 처리 해주는 함수 
   * @param : currentPage - 표시할 현재 페이지
   * @param : totalCountFunc - 테이블 데이터를 총개수를 읽어오는 함수
   * @param : dataSelectFunc - 테이블 세부 데이터를 읽어오는 함수 
   * @param : mainCallBack - 응답용 callback
   */
  boardSelect : function(currentPage, totalCountFunc, dataSelectFunc, mainCallBack) {
    // 표시할 게시물 개수
    const countList = 5;
    // 표시할 게시물 페이지 개수
    const countPage = 5;
  
    let currentPageNo = currentPage;
    let totalPage = 0;
    let startPage = 0;
    let endPage = 0;
  
    async.waterfall(
      [
        // 1. 게시물 전채 개수 가지고 오기 
        function (callback) {
          totalCountFunc(callback);
        },
        // 2. 페이징 계산 및 데이터 가지고 오기 
        function (totalCount, callback) {
          // 전체 페이지 계산
          totalPage = Math.ceil(totalCount / countList);
          // 페이지 보정
          if (totalPage < currentPageNo) {
            currentPageNo = totalPage;
          }
  
          startPage = Math.floor((currentPageNo - 1) / countList) * countList + 1;
          endPage = startPage + countPage - 1;
  
          // 마지막 페이지 보정 
          if (endPage > totalPage) {
            endPage = totalPage;
          }
  
          // 페이징 번호 저장 
          let _pageArray = [];
          let pos = 0;
          for (let iCount = startPage; iCount <= endPage; iCount++) {
            _pageArray[pos] = iCount;
            pos++;
          }
          
          // 페이징 인포 처리 
          const pageInfo = {
            currentPage: currentPageNo,
            prevPage: 0 > Number(currentPageNo)-1 ? 1 : Number(currentPageNo)-1,
            pageArray: _pageArray,
            nextPage: totalPage < Number(currentPageNo)+1 ? totalPage : Number(currentPageNo)+1
          }
  
          // 데이터 읽어오기 
          dataSelectFunc((currentPageNo - 1) * countPage, countPage, pageInfo, callback);
        }
      ],
      function (err, tableDatas, pageInfo) {
        mainCallBack(err, tableDatas, pageInfo);
      }
    );
  }
}