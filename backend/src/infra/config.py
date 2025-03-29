import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CERT_DIR = os.path.join(BASE_DIR, 'backend', 'test_certificate', 'tmp')

class LXDConfig:
    LXD_HOST = os.environ.get('LXD_HOST', '192.168.1.230:8443')
    LXD_CERT = (
        os.environ.get('LXD_CERT_PATH', os.path.join(CERT_DIR, 'lxd.crt')),
        os.environ.get('LXD_KEY_PATH', os.path.join(CERT_DIR, 'lxd.key')),
    )
    LXD_VERIFY = os.environ.get('LXD_VERIFY', False)
    LXD_TRUST_PASSWORD = os.environ.get('LXD_TRUST_PASSWORD', '')