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
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'ダウンロード';
    };

    reader.readAsText(file);
}

document.getElementById('fileInput1').addEventListener('change', handleFileSelect);
document.getElementById('fileInput2').addEventListener('change', handleFileSelect);

var fileContent1 = null;
var fileContent2 = null;

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        if (event.target.id === 'fileInput1') {
            fileContent1 = content;
        } else {
            fileContent2 = content;
        }
    };
    reader.readAsText(file);
}

function processFiles2() {
    if (fileContent1 && fileContent2) {
        const parsedCSV1 = parseCSV(fileContent1);
        const parsedCSV2 = parseCSV(fileContent2);

        // 共通のキーを見つける（例として1列目のキーを使用）
        const keyIndex = 0;
        const commonRows = findCommonRows(parsedCSV1, parsedCSV2, keyIndex);

        const outputCSV = generateCSV(commonRows);

        // ダウンロードリンクの設定
        const blob = new Blob([outputCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.getElementById('downloadLink2');
        link.href = url;
        link.download = 'only_duplicate.csv';
        link.style.display = 'block';
        link.textContent = 'ダウンロード';
    } else {
        alert('両方のCSVファイルを選択してください。');
    }
}

function parseCSV(content) {
    const rows = content.split('\n');
    return rows.map(row => row.split(','));
}

function findCommonRows(csv1, csv2, keyIndex) {
    const csv2Keys = new Set(csv2.map(row => row[keyIndex]));
    return csv1.filter(row => csv2Keys.has(row[keyIndex]));
}

function generateCSV(rows) {
    return rows.map(row => row.join(',')).join('\n');
}
