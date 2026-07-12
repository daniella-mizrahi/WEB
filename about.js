<?php
/**
 * db_connect.php — Database Connection (cPanel MySQL)
 * Used by PHP form handlers on the client-side web server.
 */

$db_host = 'localhost';
$db_user = 'diklast_room';
$db_pass = 'Roomies2026!';
$db_name = 'diklast_roomies';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
$conn->set_charset('utf8mb4');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'שגיאת חיבור לבסיס הנתונים']);
    exit;
}
