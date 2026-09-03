function Resize-Image($path, $width, $height, $quality) {
    if (-not (Test-Path $path)) {
        Write-Host "No encontrado: $path" -ForegroundColor Yellow
        return
    }
    $sizeArg = if ($height -eq 0) { "${width}x" } else { "${width}x${height}" }
    magick $path -resize $sizeArg -quality $quality $path
    Write-Host "Optimizado: $path" -ForegroundColor Green
}

foreach ($l in @("marvin","fisioderma","divinita","nueva-moda")) {
    Resize-Image "assets\img\proyectos\logos\$l.webp" 130 130 80
}

foreach ($e in @("reportes","login","inventario","entregas")) {
    Resize-Image "assets\img\erp\$e.webp" 1000 0 78
}

Resize-Image "assets\img\Caap_Nexus_negro.webp" 440 0 85

Write-Host "`nListo. Revisa el sitio con Ctrl+F5 antes de subir." -ForegroundColor Cyan
