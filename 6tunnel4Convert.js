// const url = require('url');
//
// const urlString = 'http://[2409:8087:7000:20:1000::22]:900';
// const parsedUrl = url.parse(urlString);
//
// const hostname = parsedUrl.hostname;
// const port = parsedUrl.port; // 如果没有明确的端口号，则使用默认端口6060
//
// console.log('Hostname:', hostname);
// console.log('Port:', port);
/**
 * 突然发现写这玩意还是ts香啊
 */

const {removeFirstLastChar, extractIPv6} = require('./tools.js');


let text = `#EXTINF:-1,tvg-id="广西卫视" tvg-name="广西卫视" tvg-logo="https://epg.112114.xyz/logo/广西卫视.png" group-title="卫视",广西卫视
http://[2409:8087:2001:20:2800:0:df6e:6666]/ott.mobaibox.com/PLTV/3/224/3221228183/index.m3u8
#EXTINF:-1,tvg-id="河北卫视" tvg-name="河北卫视" tvg-logo="https://epg.112114.xyz/logo/河北卫视.png" group-title="卫视",河北卫视
http://[2409:8087:2001:20:2800:0:df6e:7777]/ott.mobaibox.com/PLTV/3/224/3221228106/index.m3u8
#EXTINF:-1,tvg-id="河南卫视" tvg-name="河南卫视" tvg-logo="https://epg.112114.xyz/logo/河南卫视.png" group-title="卫视",河南卫视
http://[2409:8087:2001:20:2800:0:df6e:8888]/ott.mobaibox.com/PLTV/3/224/3221228221/index.m3u8
#EXTINF:-1,tvg-id="云南卫视" tvg-name="云南卫视" tvg-logo="https://epg.112114.xyz/logo/云南卫视.png" group-title="卫视",云南卫视
http://[2409:8087:2001:20:2800:0:df6e:6666]/ott.mobaibox.com/PLTV/3/224/3221225591/index.m3u8
`
const gateway_ip = '10.0.0.1'
let gateway_port = 2030



// 匹配地址和端口号
let regex = /http:\/\/\[[^\]]+\]:(\d+)\/[^\s]+/g;
let match;
const special_addresses_map_list = new Map()


while ((match = regex.exec(text)) !== null) {
    let url = extractIPv6(match[0]);
    let special_addresses = {
        'remote_ip': '',
        'remote_port': '',
        'gateway_port': ''
    }
    special_addresses.remote_ip = url[0]
    special_addresses.remote_port = parseInt(match[1])
    special_addresses_map_list.set(special_addresses.remote_ip, special_addresses)
}

special_addresses_map_list.forEach((value, key) => {
    text = text.replaceAll(key + ':' + value.remote_port, `/${gateway_ip}:${++gateway_port}`)
    value.gateway_port = gateway_port
})

// 删除文本多余端口

console.log('特殊域名处理完成')


const ipAddresses = extractIPv6(text);
const add_addresses_map_list = new Map()
for (let i = 0; i < ipAddresses.length; i++) {
    text = text.replaceAll(ipAddresses[i], `/${gateway_ip}:${++gateway_port}`);
    const addresses = {
        'remote_ip': '',
        'remote_port': '',
        'gateway_port': ''
    }
    addresses.remote_ip = ipAddresses[i]
    addresses.remote_port = 80
    addresses.gateway_port = gateway_port
    add_addresses_map_list.set(addresses.remote_ip, addresses)
}


let merged_addresses = new Map([...add_addresses_map_list, ...special_addresses_map_list]);
console.log(text)
merged_addresses.forEach((v, k) => {
    console.log(`tcpproxy -l ${gateway_ip} -p ${v.gateway_port} -r ${removeFirstLastChar(k)} -o ${v.remote_port}`)

})

