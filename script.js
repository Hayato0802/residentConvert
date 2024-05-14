function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const rows = csvData.split('\n').map(row => row.split(','));

        // Header row
        const headers = rows[0];
        // Data rows
        const dataRows = rows.slice(1);

        // ロジック判定（例：status列が 'active' である行をフィルタリング）
        const statusIndex = headers.indexOf('status');
        const filteredRows = dataRows.filter(row => row[statusIndex] === 'active');

        // フィルタリングされた行にヘッダーを追加
        const filteredCsv = [headers, ...filteredRows].map(row => row.join(',')).join('\n');

        // CSVをBlobに変換
        const blob = new Blob([filteredCsv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // ダウンロードリンクを設定
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'filtered_users.csv';
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Download Filtered CSV';
    };

    reader.readAsText(file);
}
