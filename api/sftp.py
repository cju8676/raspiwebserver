import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='192.168.137.225', username='pi', password='', allow_agent=False, look_for_keys=False)

sftp = client.open_sftp()
sftp.get('/media/pi/Elements SE/sample.txt', 'testtest.txt')
# sftp.put('myfile', 'location to trasnfer to')
sftp.close()