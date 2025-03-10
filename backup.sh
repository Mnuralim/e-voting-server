#!/bin/bash

# Gunakan direktori home user
BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR

# Nama file backup dengan timestamp
BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d%H%M%S).sql"

# Jalankan pg_dump untuk membuat backup
docker exec -t postgres-db pg_dump -U postgres -d e-vote >$BACKUP_FILE

# Beri pesan sukses
echo "Backup berhasil disimpan di: $BACKUP_FILE"
