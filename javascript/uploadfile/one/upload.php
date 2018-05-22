<?php
/*
// 限制文件类型和文件大小(小于20kb)
if (
  (($_FILES['file']['type'] == 'image/gif') || 
   ($_FILES['file']['type'] == 'image/jpeg') ||
   ($_FILES['file']['type'] == 'image/pjpeg')
  ) 
  && ($_FILES['file']['size'] < 20000) 
) {
// 满足条件时执行
} else {
  echo 'invalid file';
}
*/

if ( $_FILES['file']['error'] > 0 ) {
  echo 'Error:' . $_FILES['file']['error']. '<br/>';
} else {
  echo 'Upload:' . $_FILES['file']['name'] . '<br/>';
  echo 'Type:' . $_FILES['file']['type'] . '<br/>';
  echo 'Size:' . ($_FILES['file']['size'] / 1024) . '<br/>';
  echo 'Stored in:' . $_FILES['file']['tmp_name'] . '<br/>';
}
?>