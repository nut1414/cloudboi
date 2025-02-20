import os

class LXDConfig:
    LXD_HOST = os.environ.get('LXD_HOST', 'https://192.168.1.230:8443')
    LXD_CERT = (
        os.environ.get('LXD_CLIENT_CERT', '../../test_certificate/tmp/lxd.crt'),
        os.environ.get('LXD_CLIENT_KEY', '../../test_certificate/tmp/lxd.key'),
    )
    LXD_VERIFY = os.environ.get('LXD_VERIFY', False)