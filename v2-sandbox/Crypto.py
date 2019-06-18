import crypt
import sys

print(crypt.crypt(sys.argv[-2], sys.argv[-1]))
sys.stdout.flush()
