import paramiko

def sftp(filepath, dest_name):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname='192.168.137.225', username='pi', password='Carter2008', allow_agent=False, look_for_keys=False)

    sftp = client.open_sftp()
    sftp.get(filepath, 'sftp/'+dest_name)
    # sftp.put('myfile', 'location to trasnfer to')
    # sftp.remove('juicetest.jpg')
    sftp.close()