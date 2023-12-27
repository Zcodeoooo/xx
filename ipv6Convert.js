const fs = require('fs');
const axios = require('axios');

function fetchData() {
    const url = 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/Ftindy/IPTV-URL/main/IPTV.m3u';

    return axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            // 可以添加其他需要的头部字段
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error.message);
            throw error;
        });
}

fetchData()
    .then(inputString => {
        fs.writeFileSync("iptv.m3u", inputString, 'utf8');

        // 使用正则表达式提取信息
        var regex = /tvg-name="(.*?)".*?\n(.*?)\n/g;
        var match;
        var output="";
        while ((match = regex.exec(inputString)) !== null) {
            var tvgName = match[1];
            var url = match[2];
            console.log(tvgName + ',' + url);
            output+=tvgName + ',' + url + '\n'
        }
        fs.writeFileSync("iptvzb.m3u", output, 'utf8');
        console.log(output+`成功生成`);

        // ipv6 80端口添加
        const lines = inputString.split('\n');
        const modifiedLines = lines.map(line => {
            // 检查是否包含IPv6地址并不包含端口号的行
            if (line.includes('http://[')) {
                const parts = line.split(']');
                if (!parts[1].includes(':')) {
                    // 在IPv6地址后添加端口号80
                    parts[0] += ']:80';
                    return parts.join('');
                }
            }
            return line;
        });

        const ipv6_output = modifiedLines.join('\n');
        console.log(ipv6_output+`ipv6成功生成`);
        fs.writeFileSync("iptv6.m3u", ipv6_output, 'utf8');



    })
    .catch(error => {
        console.error('Error:', error.message);
    });

