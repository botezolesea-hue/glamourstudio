<?php

header("Content-Type: application/json; charset=UTF-8");

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "error" => "Nu s-au primit date."
    ]);
    exit;
}

$programare = [
    "nume" => $data["nume"],
    "telefon" => $data["telefon"],
    "email" => $data["email"],
    "servicii" => $data["servicii"],
    "data" => $data["data"],
    "ora" => $data["ora"],
    "creat_la" => date("Y-m-d H:i:s")
];

$fisier = "programari.json";

if (file_exists($fisier)) {
    $programari = json_decode(file_get_contents($fisier), true);
} else {
    $programari = [];
}

$programari[] = $programare;

file_put_contents(
    $fisier,
    json_encode($programari, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

echo json_encode([
    "success" => true
]);

?>