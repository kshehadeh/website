---
layout: post
title:  "Documenting: Boring to Write, Crucial to Read"
author: "Karim"
comments: false
---

For those who are driven, documenting what you’ve done is not only a waste of time but a task that robs you of the time to create new things and improve existing ones. On top of that it seems so pointless. Anyone who’s got even a modicum of technical ability should be able to follow the code. The code is the best documentation — and it’s always up to date. There’s no stale documentation if the documentation is the thing that is being documented.

So let’s say you were just hired. The code you are meant to help maintain and improve was written only a couple of years ago so not greenfield but not truly legacy either. I would say it’s a pretty common situation for a developer to find themselves in.

The company that hired you makes productivity software. You are on the team that is working on their web application for taking, storing and finding notes. Let’s call it “NoteTaker” to make this example a little easier to follow.

As is the case for many developers entering into a new position, their first task tends to be bug fixes to help acclimate them to the environment, the process and the code base. Your task is to fix a problem that has been reported recently. The task reads “Note category is defaulting to empty even though global settings suggest that the category should be set to <whatever>.”

You get your environment setup with the help of one of the developers. You find that the application is not monolithic. There is a frontend codebase and service oriented architecture for the backend. You get both setup and can see notes in your browser now that you have the right services running locally as well as the delivery layer that is serving up the web UI. The backend is written in Python and the frontend is a ReactJS single page app.

One of two things typically strike developers at this point: either the code base is over-engineered or not engineered enough to be flexible. Your style and the style of the previous developers dictates your reaction of course. This reaction to someone else’s work is well-documented and not the subject of this article but is important to recognize so you can push it aside to objectively look at the codebase.

In this case, you have a service that handles creation, modification, deletion, listing of notes which seems reasonable. The endpoints are typical CRUD REST endpoints. And it’s using Flask to handle routing and SQLAlchemy as an ORM. Which means that there is a Note model, a Category model, a User model etc. And they are associated with one another using SQLAlchemy’s magic hiding the SQL behind it.

You find the route that is used for creating a new note. It looks right at a glance. The category, if not given in the input, pulls the default category ID from the user’s global settings model and uses that. But, as the bug suggests, when you go to look at the newly created note, the category shows up as empty. Also, it looks correct in the database.

So you know that something is happening somewhere that is making it show up empty. Unbeknownst to you, the person who has been working on this system for a little while has a piece of information that would be helpful to you. You have a couple of choices here. The first is to keep debugging and the second is to ask someone. Your personality and the urgency dictates which will be chosen. One choice takes more of your time but helps you better understand the system. The second takes less of your time but more of someone else’s and you may or may not get a better understanding of the system depending on the person who is helping you.

But there’s a third option that, at this point, is not available to anyone. What if the behavior that leads to this situation was documented? What would be documented, though? To understand that, we have to get that extra context to understand why this happening.

“NoteTaker” had a feature added about six months ago that allowed you to share categories with other people. The person who shared the category can remove that share at will but, in the meantime, the user with whom the category was shared can add their notes to it.

![https://cdn-images-1.medium.com/max/800/0*zolovnnRqmHest66.png](https://cdn-images-1.medium.com/max/800/0*zolovnnRqmHest66.png)

The problem arises when access to the category is removed but the category is still there. As expected, User 1 no longer has access to notes assigned to that category and User 2 no longer has access to that category. But the oversight happened in User Settings where users were allowed to selected a shared category as their default category.

Now that we have this context, we know a couple of things:

- Sharing of categories is the root of the problem
- User settings wasn’t fully considered when the feature was added.

Trying to figure out the best way to solve this problem is the subject of another article. But for now, let’s concentrate on how we could have shortened the time it took to find this issue for someone new to the system.

Since the topic of this article is documentation, clearly my belief is that a modicum of well-placed documentation could have helped here.

To be clear, it is not expected that someone documented this exact use case. Because if they had they would have not introduced this bug in the first place (probably). So good documentation is not about detail, it’s about context. Figuring out the right context to provide for future you and other people is the tricky part.

A good way of knowing what to document is to set up some ground rules about what a brand new person is expected to understand without any documentation.

Existing knowledge

- You are familiar with note taking apps and what they’re for.
- Your are familiar with CRUD operations
- You are familiar with REST endpoints and best practices
- You have experience with Python, SQLAlchemy, SQL, Javascript

Those are the things that should not be documented.

Knowledge to be learned

- Relationship between entities in the system
- Business logic behind creation, deletion, updates
- Permissions
- Flow of data through the system

Documenting any one of these things would have helped hint at a cause of the problem. But the great thing about documentation is not just the effect it can have on future developers but the effect it has on the documentor. If the person who originally wrote the share category feature was responsible for updating the documentation, they could very well have stumbled on the global user settings construct and made the connection between what they were doing and that part of the code base.

So the goal is not to solve specific problems but to create an environment where problems are likely to be solved more quickly or not have been introduced at all. Additionally, with good documentation, you can get your organization out of the “hub and spoke” developer dependency tree.

![https://cdn-images-1.medium.com/max/800/0*47FZ2GYsgA9Fj336.png](https://cdn-images-1.medium.com/max/800/0*47FZ2GYsgA9Fj336.png)

Dependencies like these make it difficult to scale your organization, make estimation of stories less accurate and can lead to lower quality output.

In conclusion, documentation is not about documenting everything. In fact, too much documentation is as bad as not having any at all if not worse. Rather, focus your documentation on giving context for application-specific relationships and business logic and not on the information that is innately understood by most developers. It will make the good stuff standout and give all developers (new and old) the tools they need to be more successful.

By [Karim Shehadeh](https://medium.com/@kshehadeh) on [September 24, 2017](https://medium.com/p/28c6cf9f1b50).

[Canonical link](https://medium.com/@kshehadeh/documentation-boring-to-write-crucial-to-read-28c6cf9f1b50)