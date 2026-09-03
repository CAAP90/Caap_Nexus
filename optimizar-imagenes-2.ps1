function Resize-Image($path, $width, $height, $quality) {
    if (-not (Test-Path $path)) { Write-Host "No encontrado: $path" -ForegroundColor Yellow; return }
    $sizeArg = if ($height -eq 0) { "${width}x" } else { "${width}x${height}" }
    magick $path -resize $sizeArg -quality $quality $path
    Write-Host "Optimizado: $path" -ForegroundColor Green
}

function Make-Variant($source, $target, $width, $quality) {
    magick $source -resize "${width}x" -quality $quality $target
    Write-Host "Creado: $target" -ForegroundColor Green
}

foreach ($e in @("reportes","login","inventario","entregas")) {
    Resize-Image "assets\img\erp\$e.webp" 800 0 75
}

foreach ($e in @("reportes","login","inventario","entregas")) {
    Make-Variant "assets\img\erp\$e.webp" "assets\img\erp\$e-sm.webp" 500 72
}

Make-Variant "assets\img\Caap_Nexus_negro.webp" "assets\img\Caap_Nexus_negro-icon.webp" 100 85

Write-Host "`nListo. Revisa el sitio con Ctrl+F5 antes de subir." -ForegroundColor Cyan
