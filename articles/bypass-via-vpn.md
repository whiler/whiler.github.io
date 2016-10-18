uuid: add3a6b7-97d3-4856-b986-8f373d2b8c28
title: 用虚拟私用网络访问敏感网络
summary: 利用 域名列表 、dnsmasq 、 iptables 和 ipset 配合 虚拟私用网络 精确到域名解决网络封锁。
date: 2016-10-18

## 用虚拟私用网络访问敏感网络 ##
相对于 [绕开网络封锁访问敏感域名](bypass.html) ：

- 依赖 虚拟私用网络 ；
- 不再依赖 pdnsd ；
- 通过协议不再仅限于 TCP 和 UDP ；
- 客户端本机也可以访问敏感网络。

利用 域名列表 配合 dnsmasq 和 ipset 收集需要通过 虚拟私用网络 的流量，利用 iptables 和 ipset 识别并标记流量，配置 路由表 让被标记的流量通过 虚拟私用网络 访问。

大致的步骤：

1. 安装并配置 虚拟私用网络 服务端；
2. 安装 虚拟私用网络 客户端；
3. 创建 ipset ；
4. 将可信的 DNS 服务器地址添加到 ipset ；
5. 安装并配置 dnsmasq ；
6. 创建路由表；
7. 调整内核 rp filter ；
8. 自定义 vpnc script 。

### 安装并配置 虚拟私用网络 服务端 ###
感激 schemacs 赠送的 AnyConnect 虚拟私用网络，让我免去了安装和配置的繁琐。

### 安装 虚拟私用网络 客户端 ###
连接 AnyConnect 可以用 OpenConnect 的客户端。

### 创建 ipset ###

```
ipset create "${SETNAME}" hash:ip
```

### 将可信的 DNS 服务器地址添加到 ipset ###

```
ipset add "${SETNAME}" 8.8.8.8
ipset add "${SETNAME}" 8.8.4.4
```

### 安装并配置 dnsmasq ###
修改 /etc/dnsmasq.conf 在最后加入 conf-dir=/etc/dnsmasq.d/,*.conf ，新建并进入 /etc/dnsmasq.d 目录；
创建一个后缀为 .conf 的配置文件，为每一个敏感的域名指定可信的 DNS 解析服务器，并将解析得到的地址添加到 ipset 中。

```
echo "conf-dir=/etc/dnsmasq.d/,*.conf" >> /etc/dnsmasq.conf

mkdir -p /etc/dnsmasq.d

echo "server=/google.com/8.8.8.8"   >> "/etc/dnsmasq.d/${filename}.conf"
echo "ipset=/google.com/${SETNAME}" >> "/etc/dnsmasq.d/${filename}.conf"
```

### 创建路由表 ###
/etc/iproute2/rt_tables 保存了系统的路由表。
向文件中写入一行即可创建一个路由表。

```
echo -e "${TABLEID}\t${TABLENAME}" >> /etc/iproute2/rt_tables
```

### 调整内核 rp filter ###
由于用到部分 策略路由 ，需要将内核反向过滤策略关闭或者放宽松。

```
echo "net.ipv4.conf.default.rp_filter=2" >> /etc/sysctl.conf
echo "net.ipv4.conf.all.rp_filter=2"     >> /etc/sysctl.conf
sysctl -p
```

### 自定义 vpnc script ###
若使用 OpenConnect 默认的 [vpnc script](http://git.infradead.org/users/dwmw2/vpnc-scripts.git/blob_plain/HEAD:/vpnc-script) ，它会替换系统默认路由，让所有流量都通过 虚拟私用网络 ，显然这样不合理。

默认的 vpnc script 主要实现了两个函数 do_connect 和 do_disconnect 。

do_connect 在开始连接 虚拟私用网络 时，依次调用 set_vpngateway_route 、 do_ifconfig 和 set_default_route 三个函数，其中 set_default_route 将系统默认的路由替换成了 虚拟私用网络 分配的路由。

do_disconnect 在退出 虚拟私用网络 时，依次调用 reset_default_route 、 del_vpngateway_route 和 destroy_tun_device ，其中 reset_default_route 函数恢复系统原来的路由。

我们需要实现 start_split_tunneling 和 stop_split_tunneling 来替换 set_vpngateway_route 和 reset_default_route 完成分流。

```
start_split_tunneling() {
    # mark
    # 目的地址匹配 ipset 则打上标记
    iptables --table mangle --insert PREROUTING --match set --match-set "${SETNAME}" dst --jump MARK --set-mark "${MARK}"
    iptables --table mangle --insert OUTPUT     --match set --match-set "${SETNAME}" dst --jump MARK --set-mark "${MARK}"

    # forwarding
    # 允许流量进出 TUNDEV
    iptables --table filter --insert FORWARD --out-interface "${TUNDEV}" --jump ACCEPT
    iptables --table filter --insert FORWARD --in-interface  "${TUNDEV}" --jump ACCEPT

    # nat
    # 地址伪装
    iptables --table nat --insert POSTROUTING --out-interface "${TUNDEV}" --jump MASQUERADE

    # rule
    # 所有带标记的流量都通过指定的路由表
    ip rule add fwmark ${MARK} table ${TABLENAME}

    # gateway
    # 为路由表指定默认的路由设备
    ip route add default dev "${TUNDEV}" src "${INTERNAL_IP4_ADDRESS}" table "${TABLENAME}"
}

stop_split_tunneling() {
    # gateway
    ip route del default dev "${TUNDEV}" src "${INTERNAL_IP4_ADDRESS}" table "${TABLENAME}"

    # rule
    ip rule del fwmark ${MARK} table ${TABLENAME}

    # nat
    iptables --table nat --delete POSTROUTING --out-interface "${TUNDEV}" --jump MASQUERADE

    # forwarding
    iptables --table filter --delete FORWARD --out-interface "${TUNDEV}" --jump ACCEPT
    iptables --table filter --delete FORWARD --in-interface  "${TUNDEV}" --jump ACCEPT

    # mark
    iptables --table mangle --delete PREROUTING --match set --match-set "${SETNAME}" dst --jump MARK --set-mark "${MARK}"
    iptables --table mangle --delete OUTPUT     --match set --match-set "${SETNAME}" dst --jump MARK --set-mark "${MARK}"
}
```

参考： [ShadowVPN ipset](https://github.com/clowwindy/ShadowVPN/wiki/ShadowVPN----ipset)
