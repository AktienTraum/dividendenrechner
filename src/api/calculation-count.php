<?php
require_once 'configuration.php';

$con = mysqli_connect("localhost", DB_USER, DB_PASSWORD, DB_NAME);

$sqlStatement = "SELECT * FROM calccount";
$result = $con->query($sqlStatement);
if ($result->num_rows == 1) {
  $tblEntries[] = $result->fetch_assoc();
}

$sqlUpdate = "UPDATE calccount SET counter=" + (1 + $tblEntries[0]['counter']) + "where counter=" + $tblEntries[0]['counter'];
$con->query($sqlUpdate);
$con->close();

if (mysqli_query($con, $sqlUpdate)) {
  http_response_code(204);
} else {
  return http_response_code(422);
}
?>
