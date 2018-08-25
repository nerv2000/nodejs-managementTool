'use strict'
const async = require('async');
const fs = require('fs');
const path = require('path');

module.exports = {
  // 비동기 처리 함수
  oldSessionFileDelete: function (checkfolderPath) {
    fs.exists(checkfolderPath, function (isExists) {
      // 폴더가 없으면 리턴
      if (false == isExists) {
        console.log('old session file Delete.');
        return;
      }

      // 오래된 session 파일 삭제 로직 시작
      async.waterfall([
        // 1. 폴더의 파일 목록을 읽어온다.
        function (callback) {
          fs.readdir(checkfolderPath, function (err, files) {
            callback(null, files);
          });
        }
        // 2. 파일목록 중에 삭제 해야할 파일 리스트를 작성한다.
        , function (files, callback) {

          let count = 0;
          let deleteFiles = [];
          const currentDate = new Date();

          // 순차적인 처리를 위해서 eachSeries 사용
          async.eachSeries(files
            , function (fileName, eachSeriesCallback) {
              // 파일 읽기
              fs.readFile(path.join(checkfolderPath, fileName)
                , 'utf8'
                , function (err, dataString) {
                  if (err) {
                    eachSeriesCallback(err);
                    return;
                  }

                  // 문자열로 json을 읽었기에 obj로 변환
                  const data = JSON.parse(dataString);

                  // 만료시간 obj로 변경 하루 시간 더해서 계산하도록 처리
                  let expiresDate = new Date(data.cookie.expires);
                  expiresDate.setDate(expiresDate.getDate() + 1);

                  // 삭제 날짜 체크 
                  if (currentDate > expiresDate) {
                    deleteFiles[count] = fileName;
                    count++;
                  }

                  eachSeriesCallback(null);
                });
            }, function (err) {
              if (err) {
                callback(err);
                return;
              }
              callback(null, deleteFiles);
            });
        }
        // 3. 파일 삭제 
        , function (deleteFiles, callback) {
          // 목록에 있는 파일들을 확인하고 지움...
          async.each(deleteFiles
            , function (fileName, eachCallback) {
              fs.unlink(path.join(checkfolderPath, fileName), function (err) {
                if (err) {
                  eachCallback(err);
                  return;
                }
                eachCallback(null);
              });
            }
            , function (err) {
              if (err) {
                callback(err);
                return;
              }
              callback(null);
            }
          );
        }
      ], function (err) {
        if (err) {
          console.error(err);
          return;
        }

        console.log('old session file Delete.');
      });
    });
  },
  // 동기 처리 함수 
  oldSessionFileDeleteSync: function(checkfolderPath) {
    if(false == fs.existsSync(checkfolderPath)){
      console.log('old session file Delete.');
      return;
    }

    const currentDate = new Date();
    const files = fs.readdirSync(checkfolderPath);
    for(let count=0; count < files.length; count++) {
      const filefullPath = path.join(checkfolderPath, files[count]);
      const dataString = fs.readFileSync(filefullPath, 'utf8');
     
      // 문자열로 json을 읽었기에 obj로 변환
      const data = JSON.parse(dataString);

      // 만료시간 obj로 변경 하루 시간 더해서 계산하도록 처리
      let expiresDate = new Date(data.cookie.expires);
      expiresDate.setDate(expiresDate.getDate() + 1);

      if (currentDate > expiresDate) {
        fs.unlinkSync(filefullPath);
      }
    }

    console.log('old session file Delete.');
  }
}
