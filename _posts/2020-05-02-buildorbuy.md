---
layout: post
title:  "Build or Buy"
author: "Karim"
comments: false
summary: Some thoughts on how to decide when to build or buy and how to build if that's the decision
---

The decision to build a solution vs. buy one is a point of some contention.  There are so many factors that serve as inputs to that decision - which, themselves, are contentious - making consistent decision making elusive.  Over the years, here's the set of questions I've come to ask myself when making this decision.  This is divided into two sections.  First the question of *IF* then the question of *HOW*
{:.first-paragraph}

## Deciding IF you should build or buy

1. Is there anyone in the company who has the time and skill to create the solution right now?
    * Yes: Next Question
    * No: Buy it

2. Is there anyone in the company who can, over time, fix issues that crop up with a built solution
    * Yes: Next Question
    * No: Buy it

3. Is there an existing product that perfectly addresses the problem being solved and is it affordable?
    * Yes: Buy it
    * No: Next question

4. Is the problem core to the primary function of the company? (In other words, is there a significant competitive advantage to solving this problem better than competitors)
    * Yes: Build it
    * No: Buy it

## So you've decided to *Build* - now what?

This part is as important as the first decision.  It could make the difference between a long-lived, quality solution and a solution that imposes a burden on the company for the long term.  The goal when building a solution is to avoid "Zombie Tools" - these are tools that are barely functional and useful but just enough that it is not possible to abandon without a significant switching cost.  Zombie fans will appreciate that, like zombies, these solutions are hard to kill.  

Here are some tenets that I keep in mind if I'm building an internal tool.

### Use Existing Company Tools As Much As Possible

If there are tools that are currently being used that provide *some* aspect of the desired functionality, use them.  This is only possible if the tools expose an API or some other form of interoperability that allows for programmatic access to its functionality.   

This is a big one - because it could mean that you are only building glue code that provides a purpose-built interface to existing functionality.  

Ultimately, if you can create a solution without persisting data in a new data store, then you have created a **much** more maintainable solution.
{:.important}


### Using Zapier, IFTTT, Open Source

There *are* solutions that are purpose-built to be **glue**.  Zapier is a great example of that.  And while it does cost money, it's very versatile and can be a single tool providing multiple solutions.  This is especially true if your company has existing tools that provide some (or most) of the functionality you're looking for but falls short of the full solution.  

A common example of this is that you have a workflow tool (like Jira) but need to provide an interface to it that is not as complex and closer to the "customer" - like Slack.  While Jira has a Slack interface it's not a great integration (right now).  Zapier can help create an alternate interface to a Jira project that is hyper-focused on the need.


### Document Document Document

I cannot stress how important this is.  Keep in mind that what is being created is likely being built by someone as a part-time gig (probably).  The tempation is to build fast and build without thought to the future.  This is a terrible instinct in this circumstance - in fact, it is these types of projects that need *more* documentation.  Here's why: It is likely that whoever works on this next will have as much time or even less time to maintain or enhance your solution.  That means that the more churn you can remove from their process the better.  

Zombie tools are often very poorly documented.  They have gotten to the point where they work but folks will avoid touching them because they don't understand how they work.   They will make the decision that whatever needed to be added or fixed is not worth the risk.  *That is probably a good decision*.  So.  Give the gift of confidence to the future maintainer and document everything about it.   At a minimum document these two things:

* _How to get started developing locally_ (assume that the maintainer knows **nothing** about the technology used to build it)

* _How to deploy into the production environment_ (again, assume that they know nothing about the deployment pipeline - it's very possible that however this is being deployed is no longer the way everything else is being deployed since it was not migrated along with everything else.)

### Understand (and Share) When To Deprecate

Unless this tool gets its own team with product manager and dedicated engineering, this will likely be something that the company _wants_ to stop supporting in the future.  Don't be offended - it's nothing personal but it's probably not how the company makes money (directly) so its support will waiver depending on the leader at the time.  It's natural and understandable. 

So that said, help leadership understand why it was created in the first place and how it can be deprecated.  This will do two things: 

1. Help you justify why this needed to be built
2. Help leadership work toward an environment where this isn't necessary - either by keeping an eye out for a buy-able solution and/or putting aside budget for buying it.

There are a few reasons why a tool could/should be deprecated:
1. The problem it was solving is no longer a real problem
2. The nature of the problem has changed and there is now a buy-able solution and a budget.
3. The burden of maintenance turned out to be much higher than expected (this could justify a rewrite - not necessarily deprecation)

## Some Other Considerations

### Cost of Bought Solution

When buying something, remember that this does NOT mean zero maintainenace burden.   Remember that a bought solution that doesn't quite fit the problem will need customization and that customization can sometimes be messy and difficult to maintain.  To the point where it might be easier to build something that is a better solution and only slightly more burdensome from a maintenance perspective.  In other words, make sure when buying something that it truly solves the problem (and remember that a salesman will almost always say "Yes, we can do that".)

### Test the Solution Before Buying

As an extension of the previous point, be sure and trial the solution.  DO NOT TRUST SALES REPS about what the product can do.  Only your own staff knows what works and doesn't.  Don't saddle them with a crappy solution because some checkboxes looked checked.

### It Always Takes Longer To Build Than Planned

Most engineers gravitate to problems like moths to flame - I am guilty of this.  Licking their lips to find an elegant solution to the problem, they will often say "Oh, I can finish that in a week".  This is almost certainly not true.  It's not that they're lying - it's a case of their eyes being bigger than their stomach (so to speak).  There are complexities in every solution that are not apparent at first.  More experienced engineers will likely understand this and temper their responses.  

### When Building, Do Not Create a Perfect Solution Immediately

Well, you can't.  As with any project, do not plan six months to a year ahead of time before releasing a solution.  Get something out there quickly and test with a subset of future users.  This will help with a couple of things:

1) Quickly determine if a solution is viable.
2) Allow the engineer to focus on the features that are actually needed, not the ones that were _thought_ to be needed.

## Conclusion

All of this is to say that the decision to build or buy is highly specific to a company's situation, the nature of the problem being solved and the people available to support the decision.  Most people understand this but how to proceed is not well understood.  Use this article to help guide the decision-making process and remember to make as few assumptions as possible.