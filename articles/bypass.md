uuid: 5d1fa571-9ab2-4501-ae68-5cad22216325
title: 绕开网络封锁访问敏感域名
summary: 用域名列表、dnsmasq 、 pdnsd 、 iptables 和 ipset 配合 shadowsocks-libev 精确到域名解决 TCP 连接封锁、DNS 劫持、DNS 请求 UDP 丢包的问题，绕过网络封锁。
date: 2016-04-11

## 绕开网络封锁访问敏感域名 ##
用域名列表、dnsmasq 、 pdnsd 、 iptables 和 ipset 配合 shadowsocks-libev 精确到域名解决 TCP 连接封锁、DNS 劫持、DNS 请求 UDP 丢包的问题，绕过网络封锁。

首先，用 shadowsocks-libev 建立透明代理，绕开网络封锁；
配置 iptables ，配合 ipset 让匹配 ipset 的 TCP 数据都转发到透明代理；
利用 pdnsd 通过 TCP 向可信的 DNS 服务器转发请求；
用 dnsmasq 配置敏感的域名用 pdnsd 解析，并将解析结果写入 ipset 。

大致的步骤：

1. 安装并配置 shadowsocks-libev ；
2. 创建 ipset ；
3. 创建 iptables 规则；
4. 安装并配置 pdnsd ；
5. 将可信的 DNS 服务器地址添加到 ipset ；
5. 安装并配置 dnsmasq 。


### 安装并配置 shadowsocks-libev ###
[shadowsocks/shadowsocks-libev](https://github.com/shadowsocks/shadowsocks-libev)

### 创建 ipset ###
创建一个名为 bypass 的 ipset 。

```
ipset create bypass hash:ip
```

### 创建 iptables 规则 ###
1. 在 nat 表中新建一个名为 BYPASS 的链；
2. 让访问 shadowsocks 服务器的连接采用默认的规则；
3. 访问私有网络的连接采用默认的规则；
4. 所有目标地址匹配 ipset 的 TCP 连接都重定向到 1080 端口（本地开启的 shadowsocks 透明代理端口）；
5. 将 BYPASS 链添加到 PREROUTING 链；

```
iptables --table nat --new BYPASS

iptables --table nat --append BYPASS --destination X.X.X.X --jump RETURN

iptables --table nat --append BYPASS --destination 0.0.0.0/8 --jump RETURN
iptables --table nat --append BYPASS --destination 10.0.0.0/8 --jump RETURN
iptables --table nat --append BYPASS --destination 100.64.0.0/10 --jump RETURN
iptables --table nat --append BYPASS --destination 127.0.0.0/8 --jump RETURN
iptables --table nat --append BYPASS --destination 169.254.0.0/16 --jump RETURN
iptables --table nat --append BYPASS --destination 172.16.0.0/12 --jump RETURN
iptables --table nat --append BYPASS --destination 192.0.0.0/24 --jump RETURN
iptables --table nat --append BYPASS --destination 192.0.2.0/24 --jump RETURN
iptables --table nat --append BYPASS --destination 192.88.99.0/24 --jump RETURN
iptables --table nat --append BYPASS --destination 192.168.0.0/16 --jump RETURN
iptables --table nat --append BYPASS --destination 198.18.0.0/15 --jump RETURN
iptables --table nat --append BYPASS --destination 198.51.100.0/24 --jump RETURN
iptables --table nat --append BYPASS --destination 203.0.113.0/24 --jump RETURN
iptables --table nat --append BYPASS --destination 224.0.0.0/4 --jump RETURN
iptables --table nat --append BYPASS --destination 240.0.0.0/4 --jump RETURN
iptables --table nat --append BYPASS --destination 255.255.255.255/32 --jump RETURN

iptables --table nat --append BYPASS --protocol tcp --match set --match-set bypass dst --jump REDIRECT --to-ports 1080

iptables --table nat --append PREROUTING --protocol tcp --jump BYPASS
```

### 安装并配置 pdnsd ###
1. 修改 global 中的 query_method 为 tcp_only ，让 pdnsd 只通过 TCP 向上游 DNS 服务器转发请求；
2. 修改 global 中的 server_port 为其他非 53 端口，如5353（53 端口为 dnsmasq 留着）；
3. 添加一个可信的支持 TCP 查询的 DNS 上游服务器，如 Google 公共 DNS 服务器。

```
global {
	perm_cache = 2048;
	cache_dir = "/var/cache/pdnsd";
	run_as = "nobody";
	server_ip = 127.0.0.1;
	server_port = 5353;
	status_ctl = on;
	paranoid = on;
	query_method = tcp_only;
	min_ttl = 15m;
	max_ttl = 1w;
	timeout = 10;
}

server {
	label = "google";
	ip = 8.8.8.8, 8.8.4.4;
	root_server = on;
	uptest = none;
}
```

### 将可信的 DNS 服务器地址添加到 ipset ###
```
ipset add bypass 8.8.8.8
ipset add bypass 8.8.4.4
```

### 安装并配置 dnsmasq ###
修改 /etc/dnsmasq.conf 在最后加入 conf-dir=/etc/dnsmasq.d/,*.conf ，新建并进入 /etc/dnsmasq.d 目录；
创建一个名为 bypass.conf  文件，为每一个敏感的域名指定可信的 DNS 解析服务器，并将解析得到的地址添加到 ipset 中。内容如下

```
server=/thinkwithgoogle.com/127.0.0.1#5353
ipset=/thinkwithgoogle.com/bypass
server=/withgoogle.com/127.0.0.1#5353
ipset=/withgoogle.com/bypass
server=/google.com/127.0.0.1#5353
ipset=/google.com/bypass
```
