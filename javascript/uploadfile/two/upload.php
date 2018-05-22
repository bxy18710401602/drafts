<?php
/*
// 限制文件类型和文件大小(小于20kb)
if (
  (($_FILES['fileToUpload']['type'] == 'image/gif') || 
   ($_FILES['fileToUpload']['type'] == 'image/jpeg') ||
   ($_FILES['fileToUpload']['type'] == 'image/pjpeg')
  ) 
  && ($_FILES['fileToUpload']['size'] < 20000) 
) {
// 满足条件时执行
} else {
  echo 'invalid file';
}˜
*/
if ( isset($_FILES['fileToUpload']) ) {
  if ( $_FILES['fileToUpload']['error'] > 0 ) {
    echo 'Error:' . $_FILES['fileToUpload']['error']. '<br/>';
  } else {
    echo 'Upload:' . $_FILES['fileToUpload']['name'] . '<br/>';
    echo 'Type:' . $_FILES['fileToUpload']['type'] . '<br/>';
    echo 'Size:' . ($_FILES['fileToUpload']['size'] / 1024) . '<br/>';
    echo 'Stored in:' . $_FILES['fileToUpload']['tmp_name'] . '<br/>';
  }
} 
else {
  echo 'no file exist.';
}

?>