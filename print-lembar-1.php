<?php
include 'api/connect.php';
$sql = "select * from sppd where id = " . $_GET['id'];
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$sql1 = "select * from sppd_officer  where sppd_id = " . $row['id'];
$result1 = $conn->query($sql1);
echo "nama pegawai <br/>";
while($row1 = $result1->fetch_assoc()) {
	echo $row1['name'] . " - " . $row1['officer_id'] . "<br/>";
}

$sql2 = "select p.name as name from province p where p.id = (select c.province_id from city c where c.name = '". $row['objective'] ."');";
$result2 = $conn->query($sql2);
$row2 = $result2->fetch_assoc();


echo "<br/><br/><br/>";
echo "NOMOR : " .$row['reference_number'] . " <br/>";
echo "dasar : " .$row['base'] . " <br/>";
echo "start date : " .$row['start_date'] . " <br/>";
echo "end date : " .$row['end_date'] . " <br/>";
echo "total day : " .$row['total_day'] . " <br/>";
echo "tujuan : " .$row['objective'] ." - " .$row2['name']. " <br/>";
echo "tugas : " .$row['task'] . " <br/>";
echo "keterangan : " .$row['description'] . " <br/>";
echo "kepala : " .$row['chief_name'] . " <br/>";
?>