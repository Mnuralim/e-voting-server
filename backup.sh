#!/bin/bash

BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR

BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d%H%M%S).sql"

docker exec -t postgres-db pg_dump -U postgres -d e-vote >$BACKUP_FILE

echo "Backup berhasil disimpan di: $BACKUP_FILE"
