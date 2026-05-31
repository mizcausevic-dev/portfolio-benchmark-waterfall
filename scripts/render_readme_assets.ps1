$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null
Get-ChildItem -Path $screenshots -File -ErrorAction SilentlyContinue | Remove-Item -Force

Add-Type -AssemblyName System.Drawing

function New-BenchmarkImage {
  param(
    [string]$Title,
    [string]$Subtitle,
    [string[]]$Bullets,
    [string]$OutputPath
  )

  $width = 1600
  $height = 900
  $bmp = New-Object System.Drawing.Bitmap($width, $height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(7, 10, 15))
  $panelPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 120, 255, 170), 2)
  $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(233, 243, 255))
  $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(186, 200, 218))
  $accentBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(55, 255, 139))
  $dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(25, 199, 255))
  $fontTitle = New-Object System.Drawing.Font("Georgia", 30, [System.Drawing.FontStyle]::Bold)
  $fontSub = New-Object System.Drawing.Font("Segoe UI", 16)
  $fontBody = New-Object System.Drawing.Font("Segoe UI", 14)

  $g.FillRectangle($bg, 0, 0, $width, $height)
  $rect = New-Object System.Drawing.Rectangle(40, 40, 1520, 820)
  $g.DrawRectangle($panelPen, $rect)
  $g.DrawString("Portfolio Benchmark Waterfall", $fontSub, $accentBrush, 70, 85)
  $g.DrawString($Title, $fontTitle, $textBrush, 70, 135)
  $subtitleRect = New-Object System.Drawing.RectangleF(70, 220, 1400, 80)
  $g.DrawString($Subtitle, $fontSub, $mutedBrush, $subtitleRect)

  $y = 320
  foreach ($bullet in $Bullets) {
    $g.FillEllipse($dotBrush, 85, $y + 8, 10, 10)
    $bulletRect = New-Object System.Drawing.RectangleF(110, $y, 1320, 48)
    $g.DrawString($bullet, $fontBody, $textBrush, $bulletRect)
    $y += 72
  }

  $g.DrawString("Synthetic benchmark render for README packaging.", $fontSub, $mutedBrush, 70, 800)
  $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
}

New-BenchmarkImage -Title "Portfolio benchmark overview for the next executive review" -Subtitle "One benchmark layer for exposure, savings, investment priority, urgency, and peer-relative position." -Bullets @(
  "The overview keeps leading tracks, blind spots, benchmark delta, and dollars-at-risk visible in one executive surface.",
  "Leadership can see which lanes already outperform peers and which still need a clearer recovery plan.",
  "This layer turns scattered scorecards into one benchmark-safe board packet instead of another manual synthesis cycle."
) -OutputPath (Join-Path $screenshots "01-overview-proof.png")

New-BenchmarkImage -Title "Benchmark lane keeps peer position and next decisions connected" -Subtitle "Every route retains the audience, owner, benchmark theme, status, and next benchmark decision." -Bullets @(
  "The benchmark-lane view makes it obvious which narratives are ahead of peers and which still sit in catch-up or blind-spot territory.",
  "Board questions stay attached to actual owners and concrete next decisions instead of generic strategy language.",
  "Leadership can tighten the benchmark claim before the next board, investor, or diligence review begins."
) -OutputPath (Join-Path $screenshots "02-benchmark-lane-proof.png")

New-BenchmarkImage -Title "Peer gaps show where confidence and evidence still break" -Subtitle "Exposure, confidence, gap summaries, and comparison categories stay visible in one benchmark readout." -Bullets @(
  "This view keeps IBM, CyberArk, biotech, procurement, and revenue traces tied to actual live surfaces and benchmark lanes.",
  "Confidence gaps stay visible before the benchmark packet overclaims what the estate can really defend.",
  "Leadership can see which recovery move will remove the most friction from the next diligence cycle."
) -OutputPath (Join-Path $screenshots "03-peer-gaps-proof.png")

New-BenchmarkImage -Title "Investment waterfall keeps savings and urgency together" -Subtitle "Benchmark pressure remains grounded in investment priority, urgency, and linked proof surfaces." -Bullets @(
  "The executive story stays tied to actual investment sequencing rather than vague transformation language.",
  "Weak benchmark claims remain visible before they turn into another inconclusive board discussion.",
  "This creates a repeatable benchmark packet that can travel into diligence, investor, and operating reviews."
) -OutputPath (Join-Path $screenshots "04-investment-waterfall-proof.png")
