#!/usr/bin/env bash

# Usage:
# ./convert-to-square.sh ../public/videos-to-convert ../public/videos

set -e

INPUT_DIR="$1"
OUTPUT_DIR="$2"

if [[ -z "$INPUT_DIR" || -z "$OUTPUT_DIR" ]]; then
  echo "Usage: $0 <input_dir> <output_dir>"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

for INPUT_FILE in "$INPUT_DIR"/*.mp4; do
  # Skip if no mp4 files found
  [[ -e "$INPUT_FILE" ]] || continue

  BASENAME=$(basename "$INPUT_FILE")
  OUTPUT_FILE="$OUTPUT_DIR/$BASENAME"

  echo "Converting: $BASENAME"

  ffmpeg -y \
    -i "$INPUT_FILE" \
    -vf "scale=1024:-1,pad=1024:1024:(ow-iw)/2:(oh-ih)/2:color=#2e3750" \
    -c:v libx264 \
    -crf 18 \
    -preset slow \
    -pix_fmt yuv420p \
    "$OUTPUT_FILE"
done

echo "Done."
