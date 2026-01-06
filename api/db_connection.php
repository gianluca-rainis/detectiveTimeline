<?php
    $host = "localhost";
    $user = "root";
    $password = ""; // CHANGE BEFORE RUN
    $dbname = "detectiveTimeline";

    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn->connect_error) {
        echo null;
        exit;
    }
?>