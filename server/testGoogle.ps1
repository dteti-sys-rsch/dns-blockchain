function Test-DNSQuery {
  param (
      [string]$domain,
      [int]$iterations
  )

  $results = @()

  for ($i = 1; $i -le $iterations; $i++) {
      # Jalankan dig dan tangkap output sebagai string
      $digOutput = & dig "@8.8.8.8" $domain

      # Ekstrak Query time menggunakan regex
      $queryTime = ($digOutput | Select-String -Pattern "Query time: (\d+) msec").Matches[0].Groups[1].Value

      # Simpan hasilnya dalam array
      $results += [PSCustomObject]@{
          Iteration = $i
          Domain    = $domain
          QueryTime = [int]$queryTime # Konversi menjadi angka
      }
  }

  return $results
}

# Daftar domain yang ingin di-query
$domains = @("google.com", "ugm.ac.id")

# Jumlah iterasi yang diinginkan
$iterations = 10

# Jalankan query untuk setiap domain secara berurutan
$allResults = @()
foreach ($domain in $domains) {
  $testResults = Test-DNSQuery -domain $domain -iterations $iterations
  $allResults += $testResults
}

# Output hasil
$allResults | Format-Table -AutoSize
