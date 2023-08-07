---
layout: post
title:  "Moving From Notion to Markdown"
author: "Karim"
comments: false
---

I recently made the switch from Notion to Markdown for a couple of reasons.  First, Notion is amazingly featureful and especially good with teams but I found it to be overbearing for personal notetaking.  Ultimately, it opted to focus more on teams and enterprise - which I respect.  Thanksfully, Notion makes it pretty easy to export to common formats - markdown, in my case.  

The next question was how do I get my notes shared on all my devices.  Because these note taking apps are particularly helpful for making your notes available on all devices.  Given the proliferation of Dropbox-like services like iCloud, Google Drive, etc. I figured that this wouldn't be too much of a problem.  

Finally, I wanted to have a good editor that gave me access to the bare markdown without sacrificing helpful editing conveniences.  In other words, I didn't want just a text editor - i wanted something that could give me some preview capability for basic formatting like headlines, bold, code, etc.

I looked at several different tools to help out with this.  What I ended up with was Obsidian and iCloud.

## Why [Obsidian](https://obsidian.md)

Obsidian had a few things going for it and a couple of detractors.  The benefits were that it had a mature and fairly stable set of applications on multiple platforms include iOS and MacOS.  Second, it had an extensive community plugin catalog with a lot of extremely helpful utilities.  Finally, it worked well with iCloud - which is a service that I already pay for and could do the syncing for me over multiple devices.

The detractor for Obsidian is that it's not open-source.  As it happens, I'm not as worried about the OSS part of this as I am the portable nature of the content I'm storing.  Meaning that as long as my content doesn't live in a walled-garden, I'm okay.  The fact that the gardening tools I'm using are a black box is okay for me.

## Why iCloud

This is mostly because mac-based apps like Obisidian work well with iCloud I've found and I'm already paying for extra storage so it made sense to use it for this as well.  I could have gotten Obsidian's Sync service but it seemed unnecessary given my existing iCloud account.  Also, part of the reason I'm doing this is to reduce the number of subscriptions I have and to be less dependent on proprietary services.

## Runners Up

I found [Logseq](https://logseq.com) and [Silver Bullet](https://silverbullet.md) to be excellent tools in this space.  They are both open source which is a plus.  The downside for Logseq was it's complexity - lots and lots of features that are not super well packaged for my taste.  Silverbullet was incredibly simple but isn't yet to the maturity level it would need to be for me to use it day to day.

## Migrating From Notion

Notion allowed for the relatively easy export of markdown files.  The problem is that it exported files that included GUIDs (which I understand the purpose of).  Thankfully, these are just files on a filesystem so it was relatively easy to fix this. 

```bash
regex=$1

find . -depth | while read file; do
  # Skip if the file is . or ..
  [ "$file" = "." -o "$file" = ".." ] && continue

  # Split the file into basename and extension
  base=$(basename "$file")
  ext="${base##*.}"
  name="${base%.*}"

  # Remove the GUID and trailing spaces from the name if it is at the end
  newname=$(echo $name | sed -E "s/${regex}$//g" | xargs)

  # Check if there is an extension. If there is, append it to the new name
  if [[ $name != $ext ]]; then
    newfile="${newname}.${ext}"
  else
    newfile="${newname}"
  fi
  
  # Compute the new path with the updated filename
  dir=$(dirname "$file")
  newpath="${dir}/${newfile}"
  
  mv -- "$file" "$newpath"
done
```

And ran it with this:

```bash
./rename-based-on-pattern.sh "[0-9a-f]{32}"
```

I'm not particularly good with bash but this seemed to do the trick.


## Parting Thoughts

I'm on week 3 of this transition and so far so good.  I like the freedom of knowing that my notes, which I've been maintaining for 15 years are in a format that is very portable and duplicated in multiple places - both locally and in the interwebs.  