---
layout: post
title: Life of a Project
author: Karim
comments: false
---

Projects have a pulse. Like most living things, they are born, grow, mature and finally, well, let’s call it retirement. The phases of their lives bring different challenges and opportunities. Trying to treat every phase of life the same way will not yield the best possible results. So I’d like to touch on the different phases of a project, their difference and some approaches to managing them to yield the best possible results.

# Birth

Ideas come and go. Some make enough of an impression that they stick. When that happens, there are so few constraints that wheels tend to spin. Either because there isn’t enough focus to make decisions or because no one is invested in the idea because it’s so far from becoming *project* that everyone is focused on their current “real” projects.

## Dealing with Analysis Paralysis

It would help in these times to have an overall vision for your project or even your company’s mission. Armed with that, each choice can be weighed against how well it fits with the vision of the company. Hopefully what you *want* to do and what makes sense to do are the same thing. But you should be willing to dig into the reasons you want something to find out if it’s for the right reasons (e.g. is it because you’re interested in the subject matter or technology or because you truly believe it will be the right thing for the business).

## Dealing with Lack of Focus

Everyone’s busy. That’s expected and not a bad thing. But there has to be time in key decision makers’ schedules (technical lead, product owner, project manager, etc.) to start working through initial thoughts on the next project. What I’ve seen happen is this:


Serious technical discussion about the project doesn’t start until the previous project the execution team is working on is winding down. But because the expected completion time frame is applying pressure to the team there’s a tendency to rush through initial architecture discussions, requirements gathering (that includes all parts of the execution team), groomings, and plannings. This gives the impression that the team is hitting their timeline early on. But the lack of proper understanding of the use cases (which is often a consequence of this rushed start) leads to a slow-down in implementation, poorly estimated stories, frequent miscommunication and more.

So I’ll reiterate that while it may seem premature to discuss technical details weeks before execution starts, I truly believe that you will, in the end, save yourself and the team a lot of anxiety and time by doing so.

## How to Talk About The Idea

I love drawing things and so it is inevitable that my recommendation for getting a project started is to find yourself a whiteboard, a dry erase marker and diagram the hell out of your project. I highly recommend this approach for a number of reasons:

1. I truly believe most people get a better understanding of a problem when they see it in picture form. For a long time I thought it was just a smaller segment of the population that employed this technique and got use out of it. But the number of times I have cleared up confusion in a meeting with a diagram is high enough that I’m now convinced that most people — whether they know it or not — benefit from it.
2. Just the act of writing use cases down in diagram form can quickly reveal gaps you hadn’t considered.
3. You can use what you’ve drawn as a reference for future discussions so you don’t have to start from scratch with each new meeting on the subject.

Here’s an example of a drawing that might go up as we discuss a use case for a new feature for a NoteTaker app which allows users to share notes with others users.

[https://cdn-images-1.medium.com/max/800/0*9HyejRzQVrapdyOZ.](https://cdn-images-1.medium.com/max/800/0*9HyejRzQVrapdyOZ.)

With this as a conversation piece we can start picking apart pieces like does the MVP need to include sharing with multiple people at once? Where does UX need to play their part? Also note that we have not started the technical discussion but some representative of the engineering team is part of the discussion.

# Adolescence — What

Birth is mostly a honeymoon period where dreams of what could be still thrive. Arguments are more about what *kind* of amazing the final product will be. As we get into the growth stage of the project, reality starts to set in. At this point a few things start to taint our pure vision. Things like:

1. Resource constraints
2. Technical constraints
3. Organizational constraints
4. Operational constraints
5. Time constraints

It’s at this point that the aforementioned *focus* becomes indispensable. Like a book editor, your role at this point is to prune. Find the requirements that are nice-to-haves but not critical and which are required for an MVP.

## Pruning for Constraints

Armed with your vision, business value, and customer value you can work through your requirements to see if the project can fit within the constraints.

Let’s go back to the note sharing example. The team that is available to work on this is made up mostly of backend developers. A consequence of some team shuffling that had to be done earlier in the year. We should not try to curtail the UI experience and still provide value.

Based on the workflow that we have described above, let’s remove the user autocomplete interface and, instead, the user will have to enter the full name of the user. The backend will verify that the user exists and if it doesn’t, return an error. Not a good user experience but adding the auto complete will likely add at least one more sprint because there are no similar components in other parts of the UI to share.

At this point, the product owner and stakeholder have to make a decision about whether this experience is required for MVP. The questions that should be answered are:

1. Can the customer still get value from the feature without that requirement?
2. Will the absence of this requirement sour users from using it in the future?

If the answer to #1 and #2 are yes and no respectively then we should remove. Making this distinction is a difficult process in part because there are so many unknowns. It’s important to work through it though because in the process you will enhance your understanding of the feature and its true value. Analogy time!

### <analogy>

Your car is on its last legs so you start to browse. You eventually end up at an Audi dealership and take a sedan out for a test drive. You’re smitten — the heated seats, the seat position memory, the carplay integration, sunroof, autonav, and all the other bells and whistles make for an incredible driving experience.

Now you’re back at the dealership and he tells you the price. Reality sets in and you realize that your cost constraint is going to force you into a tough decision. You ask which features you can remove to get the cost down to your expectations. He tells you that we can remove the autonav package and shave off $5000.

The question you have to ask yourself is this: was the magnificent driving experience you just had only possible with the autonav feature? Sigh. Probably not. Okay, but we’re still about $3000 off my ideal price.

The negotiations continue and you eventually realize that you can’t afford the experience you were hoping for. So at this point something else has to budge. In the case of the dealership, the dealer will probably lower the price the extra $3000 and you’re good to go.

Back to our project. The car is, of course, the project. The bells and whistels are the requirements and the driving experience is the vision. Making a decision is about truly understanding the value of your vision. The process of pruning is a crucible that, hopefully, will burn away the impurities and leave a pure core of value. It has happened to me that this process has left nothing. At which point I really had to examine if my idea was every any good. And that’s okay.

## Pruning For Feedback

There’s another reason you would want to prune your MVP and that is getting feedback from the user as soon as possible. This is essentially establishing a time constraint of your own making.

Sometimes there’s no amount of discovery you can do that will accurately yield the best possible requirements for the user. So one option is to put a super minimal feature set that serves as a good foundation and let the users guide your requirements going forward.

While I think this is a great way to test theories and guide development it continues to be important to keep the initial vision in mind. I say that not because you should cling to it regardless of feedback but because if you don’t check in with your vision periodically you could be chasing a set of unfocused and incompatible suggestions that do not serve *any* vision. If you find yourself falling into this trap of being too reactive, you should periodically regroup with your stakeholders examining feedback from users to find patterns that may suggest that the initial vision was not necessarily what users needed.

# Coming of Age — How

By this point you have a viable set of requirements and stories. The product owner and the implementation team is in sync and discussions about *how* to execute can begin. Projects at this stage can be unpredictable. The goal is to minimize unknowns as much as possible.

## Weight

Whenever I’m approaching a large body of work, I find the heaviest items as my first task. I will often refer to tasks by weight to not get bogged down in the meaning of points. The heavier tasks are a combination of a large number of unknowns and/or a large amount of effort (complexity). Heavy tasks invariably take longer than you expect. Getting those done first will help reduce unknowns later in the project. Remember that we want to get *more* predictable as the project progresses. Leaving complexity to the end or middle of a project makes that difficult.

It’s important to note that heavy is not necessarily the same as time consuming. What we’re looking for here is unpredictability because it’s that which derails projects. And it just so happens that the more effort behind a task, there’s a higher chance of encountering the unexpected.

[https://cdn-images-1.medium.com/max/800/0*2UIsmL9Y9POjy1MJ.](https://cdn-images-1.medium.com/max/800/0*2UIsmL9Y9POjy1MJ.)

We will discuss more about unknowns a little later.

## Concurrency

Now look for things that should be done in parallel. And note that I use the word *should* not *could*. Just because you can work on multiple things at once doesn’t mean you should. To identify what should be done in parallel look for tasks that are truly independent of one another.

## Task Independence

Independence means that it truly does not matter how one task is completed — it will never affect the implementation of the other. In the venn diagram of tasks, these tasks’ circles are nowhere near each other. The idea behind this is that we can rest easy that no rework will have to be done — removing that inefficiency from the process.

To identify tasks that are independent, ask these questions:

1. If one task’s execution does not go as planned, will the other necessarily have to change?
2. Is one task’s output to be used by the other?
3. Are both tasks modifying the same shared resource?

If the answer to any of these is yes then avoid concurrent implementation.

This will not be a popular position to take for some because it will seem like execution could go faster if more coworkers are engaged to support the project. And depending on the relationship between those engineers, the answer could be that it would. But dependent tasks (as defined above) necessitates communication that would otherwise not be needed. And communication (or miscommunication) is always where inefficiencies are injected.

### Overcoming Task Dependencies

But if you find yourself in a position where concurrency is truly required, then you can reduce the chances of miscommunication in a number of ways.

1. The folks implementing the tasks are physically in the same place
2. Daily checkins (standups) to share progress
3. Frequent commits

In all cases, the goal is to strengthen communication for the purposes of increasing transparency. Make it like one person with two brains and four hands is working on these tasks.

## Unknowns

So we know we want to maximize predictability and we know that the unexpected makes it difficult to maintain prediction accuracy. We also know how we can organize tasks to limit surprises by avoiding interdependencies and front-loading weightier tasks.

But when trying to understand the weight of the task it is not at all unusual to face problems with simply being unfamiliar with the task at hand. So how can we identify what we don’t know?

### **Discovery**

Yes, you can always create a separate task that amounts to “discovery” but I find that to be unpredictable in and of itself because of the vagueness of its goals. You can’t really know for sure when to *stop* “discovering” if you don’t know a lot about the system in the first place. So you will make a best guess about when you have enough information and point confidently from there. But my concern lies in the fact that you can get a false sense of security during and after this investigation. I would prefer weighing this task higher to account for the unknown and doing the discovery as you accomplish the task. By knowing at the outset that there are a lot of unknowns in the task then you are more likely to front-load.

### Knowing the Unknown

So I can’t emphasize enough that postponing unknowns is a good way to balloon the timeline at the worst possible time. But how do we recognize unknowns early on?

This is the hard part especially in cases where you are not familiar with the system. But there are ways to make some guesses about where you might encounter the biggest problems. Here are some things to look for:

- Has the thing that you’re working had a lot of people touch, updating, fixing before you? Often the longer a thing has been around and the more it has been fiddled with, the more likely there are to be some surprises.
- Does a task require communication with a third party? Assume that they won’t respond in any reasonable time frame. Their priorities are not necessarily the same as yours.
- Are you not following some of the rules above and working concurrently on tasks that are interrelated?

# Maturity

## Release Early and Often

The project, at this point, has progressed through several completed stories. It’s important that these stories are deployed into production (perhaps hidden) and have gone through as much regression testing as possible as each is delivered. The smaller the deploys, the easier they are to test and the smaller the damage done if bugs make their way through the gauntlet of testing.

## **The Importance of CI/CD**

The one caveat to that is that the frequency of deploys is dependent on the overhead of deployment. A low-overhead deployment process like CI/CD is incredibly important to a well-running software organization — release early and often. But if you do not have that then test in your next best environment as though it were production. It won’t catch everything but it’s better than waiting 2 weeks to test a collection of issues at once. That is an extremely inefficient process the perils of which I won’t get into here.

## The Older Model

As we enter into the middle and end of our release we start to approach a period where older thinking would suggest that all our testing takes place now. There’s a number of problems with this of course — not the least of which is that it leaves so much uncertainty to the very end of the project. This model will almost certainly create a stressful period of uncertainty as problems that could have been found much earlier are discovered. Fixing them now is not only harder because there are so many changes that have to be regression tested, but because finding the cause of the problem is more difficult because of the number of changes that were made.

## The Newer Model

A more reasonable approach would be to, whenever possible, commit your changes for a story, test and release. While there will no doubt be issues found at the end of the project, you have minimized the uncertainty dramatically by identifying the most obvious issues early and dealt with them in a more holistic way. What you will find happens with this approach is that velocity not only increases as a result, but predictability improves as well.

# Retirement

At this stage, the work has been done and tested and released into production.

## Measuring Success

The importance of measuring the success of your solution cannot be understated. Hopefully there won’t be any surprises, but whatever information you can glean is fodder for decisions you will need to make for future iterations of this system.

The type of change dictates the way measurement occurs. For example, website changes to a highly trafficked feature of the site can be analyzed through web analytics or direct user feedback.

Other types of changes that are user facing can be measured through interviewing stakeholders and end-users.

## Reflect on Process

The success of the feature itself is mostly independent of the process for implementing it. For that reason, I recommend a project retrospective.

The goal of this discussion is to cover some or all of these subjects:

1. What parts of the project did not go as planned
2. What parts of the project went as planned
3. What should we do differently in the next project
4. What should we do the same in the next project.

While iterative development can help us understand the good and bad of a team’s execution, a project retro can give us insight into the entire lifecycle of the effort. But like a sprint retro, the project retro should have action items that are followed up on by someone who has responsibility over the process.

# Conclusion

So the life of a project is a dynamic one. Each stage of its life brings new challenges and opportunities. My experience has brought me to some of the conclusions above, but future experiences will probably refine or even completely change some of these approaches.

## Be Humble

And that’s the most important thing to remember about any task you take on. Avoid getting so entrenched in your mental model that you are unwilling to truly consider others’ suggestions and approaches. Even if it sounds absurd, take the time to understand what brought them to that conclusion. It’s an opportunity for you to learn from *their* journey, not just the ones that you have been on. While you may disagree with the conclusions they drew from their experience, you can at least use their experience to make better arguments for your approach.

## Be Trusting

This leads to one final comment about being part of a large project. Trust is absolutely critical. Without it, communication will break down. And without good communication, the project will break down. Of course, you can’t just *trust* someone if you don’t feel that way. I don’t usually say this, but, in this case, fake it. Not always, of course, but sometimes. It’s a way of reaching across the divide and meeting someone halfway and starting to establish trust. The bridge won’t be built in a day but construction will begin.

By [Karim Shehadeh](https://medium.com/@kshehadeh) on [October 7, 2017](https://medium.com/p/fc88498f6354).

[Canonical link](https://medium.com/@kshehadeh/life-of-a-project-fc88498f6354)