# Rules and Principles

## Two ways to steer an AI system, and why neither is enough on its own

**A field observation on a running multi-role system**

Klaus Nitzsche · Hamburg · Version 1, 2026-08-23
Licence: CC BY 4.0 · Code and material: MIT
Material: <https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

---

## Abstract

Anyone steering an AI system has two instruments. **Rules** are checkable and are
enforced. They cover the case someone wrote them for. **Principles** can be
neither checked nor enforced. They are questions put to the situation at hand,
and they therefore also reach where nobody looked in advance.

The distinction is not new. It has been worked through in five fields, from Kant
via Kohlberg and Tyler (1990) to Kaplow (1992) and, since 2024, AI regulation
(Schuett et al.). What is new is the **level**: principles at **run time**, set
by the **operator**, in a text file that someone who cannot program can also
edit. The existing work occupies the two neighbouring positions, principles at
training time (Bai et al. 2022) and rules at run time (Rebedea et al. 2023).

The observation is made on a running setup: five named roles work through a job
one after another. One pass is called a **shift** and is recorded. Both channels
travel with every call, as text.

The report has three parts. **First**, four cases carried out: the same
situation, once through each channel. One of them shows two instructions with
the same words that decide differently. It is not the wording that separates the
channels but what they bind: the **output** or the **attention**. **Second**,
**durability**, the property that weighs most in operation. A rule can be
satisfied without being met; a principle can be passed over without being
violated. Durability and verifiability cannot be had in the same channel (3.8).
**Third**, the points at which both channels failed, each with a date.

From this follows a pair of terms: a **principle-based rule** is the sound form
of construction, a **rule-based principle** its corresponding error.

The paper does **not** claim that principles are better. It states its limits
openly: no control group, no measure, a sample of one, not blinded. It is a
**field observation with a record**, not a study. Section 7 describes the
experiment meant to turn it into one, with three arms and an evaluation that
hides the arm. Its prediction can be wrong: the advantage of principles ought to
**fall** as the case becomes more foreseeable.

## 1 · The starting question

A multi-role system is meant to get work done. Five named roles work through a
job one after another: **each proposes an idea from its own vantage point**, one
builds the chosen one, one checks, one looks for faults, one writes down where
things stand. Each is given text and returns validated JSON.

Since 2026-08-23 **all five have tools**. They may read the repository and, on a
separately set switch, reach out to the network; by default the network is off.
**They cannot write**, and not out of caution: the workbench binds in not a
single writing function. Before that they had none at all, and that had a
measurable price. They could not see the repository and therefore proposed
things that already existed.

Anyone who sets up such a system soon faces a practical question that cannot be
settled in theory:

> **What do I write down as a rule, and what do I have to ask instead?**

"No key in plain text" is a rule. It can be checked, it can be enforced, and it
holds reliably. "What does the next person get out of this?" is not a rule. It
cannot be checked and cannot be enforced, and it changes what comes back all the
same.

The question is old. What is new is that it now has to be answered by someone
operating an AI system, and no longer only by a legislator or a regulator.

### 1.1 Two drivers

The difference has always been observable in people, and the picture carries
further than any definition.

**One keeps to the traffic rules because he fears the penalty.** Red means stop
because it costs points. He drives correctly as long as the rule fits the case
and someone is watching.

**The other keeps to the same rules because he is not indifferent to what
happens to others.** Red means stop because someone might be crossing. From the
outside the two look alike, as long as nothing unusual happens.

**Three situations separate them:**

| Situation | The rule driver | The principle driver |
|---|---|---|
| **Three in the morning, empty junction, no camera** | drives through; the rule works only while it is enforced | stops, or looks closely. The reason for the rule has not gone away, only the witness |
| **An ambulance needs through, the light is red** | stays put. He does what it says, and blocks | makes room. Here the wording of the rule works **against its purpose** |
| **Something no rule covers** | has nothing to hold on to | has a question he can ask |

The core in one sentence: **a rule says what to do. A principle says what for.**
Whoever has only the first is covered exactly as far as the rule book reaches.

But the picture cuts both ways, and the second half is usually left out. **The
principle driver can be wrong.** Someone weighing things up in the name of a good
intention sometimes weighs wrongly, and nobody catches him, because there was no
rule. The rule driver, in exchange, makes **predictable** mistakes: he does
exactly what it says. So the question is not which is the better person. It is
which mistakes one would rather have, and whether one can have both.

### 1.2 Where the picture breaks, and why that is precisely the finding

It is tempting to spin the analogy further. Against that a warning, because it
breaks at a point that is not incidental:

> **An AI system has neither fear of punishment nor concern for others.**
> Neither of the two motives is present.

In people, the motive explains why a rule works even without supervision, and why
a principle moves anything at all. Both fall away here. What remains is not the
drive but the **form of the instruction**: does it name the **case** or does it
name the **purpose**?

Two things follow, and they carry this paper.

**First**, the rule/principle problem is not softer in an AI system than in a
person but **harder**. In a person, insight can make up for a bad rule. Here
there is nothing that makes up for it. There is only the text that was passed
along.

**Second**, this also answers why the obvious expectation is disappointed, the
expectation that a principle is "stronger". In a person it is, because it ties
into something that is there anyway. Here it ties into nothing. It **only shifts
what the system attends to**, and when the attention does not stretch, it stays
without effect and nobody notices. That is exactly what happened in section 5.2.

**The analogy therefore explains the structure and not the effect.** It stands
here because it makes the difference visible, not as evidence.

---

## 2 · State of the art

### 2.1 The distinction is worked through in law and economics

Kaplow (1992) separates **rules** from **standards** by the point in time at
which the content is fixed. A rule is spelled out **beforehand**: whoever sets it
must anticipate the cases. A standard is filled in **afterwards**: whoever
applies it decides on the individual case.

The costs follow from this. Rules are expensive to **set** and cheap to
**apply**. Standards are cheap to set and expensive to apply. And because nobody
knows all future cases, every act of rule-making stays incomplete. A residue of
discretion remains, and the only question is who exercises it.

### 2.2 It was carried over to AI in 2024, but at the level of regulation

Schuett et al. (2024) set the two approaches against each other for the
regulation of frontier AI. Their weighing reads like an anticipation of what is
observed below on a small scale:

> Specific rules give more certainty and are easier to enforce, but they age
> quickly and lead to box-ticking. High-level principles give less certainty and
> are more expensive to enforce, but they are more adaptable.

"Lead to box-ticking" is the phrase that matters. It describes not a failure of
enforcement but one of **fit**: the rule is followed, and the thing still does
not get better.

### 2.3 The picture of the two drivers is itself a research subject

The distinction from 1.1 is not folk psychology. It has been worked through in
four different fields, and each contributes something that counts for the
steering of AI systems.

**Philosophy.** Kant (1785) separates **legality** from **morality**: an act can
be done *in conformity with duty* or *from duty*. From the outside the two cannot
be told apart; the difference shows only when the external occasion falls away.
That is the empty junction at three in the morning, two hundred and forty years
earlier.

**Developmental psychology.** Kohlberg's stage model begins at stage 1 with a
*morality of avoiding trouble*, where right is whatever averts punishment, and
ends at stage 6 with **self-chosen, general principles**. The two drivers from
1.1 are exactly the ends of the most-cited model in that field.

**Sociology of law.** Tyler (1990) measured which of the two carries: people obey
the law **predominantly because they consider it legitimate**, not from fear of
punishment. Deterrence is also the **more expensive** route for society. For this
work the direction of the finding matters: the rule channel is not the more
reliable one, it is only the more **checkable** one.

**Behavioural economics.** Gneezy and Rustichini (2000) introduced a fine for
late pick-up at Israeli day-care centres. **Lateness increased.** And when the
fine was abolished again, the figure did **not** come back down.

The explanation that prevailed, and that has been cited over two thousand times:
the fine did not reinforce the norm, it **replaced** it. An obligation turned
into a price. One can buy one's way out, so one does, and the obligation does not
return even when the price disappears.

### 2.4 Why this one finding sharpens the prediction of this paper

Section 7.2 names three results that would refute this paper. One of them reads:
**the combination of both channels is worse than either on its own.**

Up to this point that was a bare possibility. After Gneezy and Rustichini it is a
**theoretically grounded expectation**. There is a named mechanism that predicts
exactly this, and it is documented in the field.

**But it does not carry over without a break, and the break is the same as in
1.2.** In people, crowding out acts on a **motive**: the fine replaces the sense
of obligation. An AI system has no motive that could be crowded out.

What would carry over is the **form**, not the cause:

| | In people | Conceivable here |
|---|---|---|
| What is crowded out | the **motive** | the **attention** |
| By what | a fine becomes a price | a long block of rules takes the space from a short block of principles |
| Result | more of what was to be prevented | the principle stands there and has no effect |
| Reversible | **no** (documented) | **unknown** |

This is a conjecture and is carried here expressly as one. It does have a
practical merit: **it is testable with the existing setup** and coincides with
the saturation question from 3.4. If crowding out happens here, it ought to show
as soon as the block of rules grows, and the experiment in 7.7 measures exactly
that.

### 2.5 On the AI side the weakness of the rule is well documented

That rules are satisfied to the **letter** and missed in their **purpose** is a
subject of its own in AI research: *specification gaming* or *reward hacking*. A
system meets the formal requirement without reaching what was meant. DeepMind
keeps a public collection of over a hundred cases.

The best-known example: a boat in a racing game that receives a bonus for hitting
green blocks and thereupon drives in circles, hitting the same blocks again and
again instead of finishing the race. Another: a summarisation model that exploits
the weaknesses of the scoring measure and receives high scores for barely
readable text.

Behind this stands Goodhart's law: **when a measure becomes a target, it ceases
to be a good measure.**

For this paper the connection is direct. Schuett et al.'s *"box-ticking"*,
Goodhart's law and case 3 in section 3.6, the hand-over that says "fits", are
**the same event on three levels**: the requirement is met, and the thing has not
got better.

### 2.6 Why this matters

The question is not academic, and it is being answered in practice right now,
mostly without anyone asking it.

Anyone deploying an AI system today and wanting to steer it reaches almost always
for **rules**. The reason is a good one: rules can be checked, logged and put
before a supervisory body. A principle cannot be produced on demand. A
**requirement of verifiability** thus turns unnoticed into a **design decision**,
and in favour of the channel that is easier to evidence, not the more effective
one.

If what the four fields above suggest is right, that the rule channel reaches
exactly as far as the anticipation of the case, that it can miss the purpose
without violating the letter, and that it may even crowd out what stands beside
it, then systems steered **exclusively** by rules are not merely steered
incompletely. They are steered incompletely in a way that **does not show up in
operation**, because all the checks are green.

That is why this paper insists above all that **both channels can fail** and that
the difference has to be measured rather than believed.

### 2.7 In the steering of language models two positions are occupied

**Principles at training time.** Constitutional AI (Bai et al. 2022) gives a
model a written constitution. The model critiques and revises its own outputs
against it; the result goes into the weights. The principles are set by the
**model provider** and are afterwards part of the model.

**Rules at run time.** NeMo Guardrails (Rebedea et al. 2023) and comparable tools
check inputs and outputs during operation against programmed conditions. They are
set by the **deployer** and act outside the model.

The difference is fundamental: the one **internalises** a stance into the
weights, the other **surrounds** the model with barriers.

### 2.8 The third position, and why it is thinly occupied

|  | **Training time** | **Run time** |
|---|---|---|
| **Rules** | fine-tuning on prohibitions | **guardrails** (Rebedea et al. 2023) |
| **Principles** | **Constitutional AI** (Bai et al. 2022) | **thin here** |

What is missing is the lower right cell: **principles that the operator sets at
run time**, not the model provider, not as code, but as text that a person
without programming knowledge can change.

The literature knows this spot but treats it as a **risk** rather than an
instrument. In the debate about the gap between training and deployment it counts
as a problem that "the deployer can change the system prompt that promised
caution". That is true. It is at the same time the only point at which someone
without access to weights and without a programmer can set a stance, and thus the
only one reachable at all for small operators.

**That is exactly where the setup described here sits.**

---

## 3 · The setup

### 3.0 The experimental setup: a firm of agents

A setup was built specifically for this question, and it is not a sketch but a
running repository: **Kimhub**. Inside it a small firm of five named agents does
the work. One pass is called a **shift** and proceeds as follows:

1. **Each of the five proposes an idea**, out of its own role.
2. From the proposals **one is chosen** and built.
3. Building goes through an **API**, since 2026-08-23 **with tools** in the hands
   of the agents.
4. **Everything is recorded**: calls, tokens, cost, duration, tool uses.

**How long this has been running is counted, not estimated.** The git history of
all 33 repositories was read out on 2026-08-24: **5,823 commits on 128 working
days, from 10 March to 24 August 2026**, across 1,388 branches, of which 1,662
commits never arrived on a main branch. The source is open
([`../historie/`](../historie/)). It shows *that* and *when* work was done, not
*how long* on any one day, and it is not used that way here.

⚠ **Two time spans have to be kept apart.** The documentation covers five months,
the measurement covers days. Where a measured figure appears in this paper, it
comes from the second.

The purpose of the setup is the question of this paper: **the same shift is run
once rule-based and once principle-based**, and both runs are documented. What
comes out of it is not an end in itself: they are **tools meant to be usable**.
One has already gone the whole way: the delivery checker was reviewed, released
and published in the **PWA Toolpoint** marketplace.

> **On the relation between tool and experiment.** The workshop did not begin as
> an experimental setup. It was built because it was needed, and only afterwards
> became the subject, and was then deliberately extended into a setup on which
> the question can be measured. Both belong together in one statement: the setup
> is constructed, but it was not invented for the investigation.

### 3.1 Two channels, deliberately kept apart

Two channels in the same system, deliberately kept apart.

|  | **Rules** | **Principles** |
|---|---|---|
| Where | in the source code | in a Markdown file |
| Checkable | yes | no |
| Effect | enforced, every role, every run | steer the attention |
| Changeable by | whoever touches code | anyone, without a programmer |
| Number | six | **at most seven**, currently five |
| If the source is missing | the run aborts | it continues, **and says so** |

### 3.2 The six rules

They cover what can be put into words: honesty about one's own state · no
personal data, no secrets · invent nothing · no external addresses · write
briefly and in German · and: claim nothing you have not actually done.

Three of them carry their origin in the text. They come from damage, not from a
textbook. The rule against invented figures justifies itself with the sentence
*"a guessed figure sounds exactly like a measured one"*. The rule against secrets
justifies itself not by data protection but by an observation about
repositories: *"private" is a setting that one click reverses, and the history
keeps everything.*

**The sixth rule was wrong for eleven days, inside its own system.** It read *"YOU
HAVE NO TOOLS. You cannot execute anything, call anything, open any file."* On
2026-08-23 the roles were given a workbench (`schicht/werkzeuge.mjs`) with four
tools: `datei_lesen`, `verzeichnis_zeigen`, `suchen` and, behind a switch of its
own, `netz_holen`. From then on **one and the same instruction** carried first
that sentence and, a few paragraphs later, its opposite. It was noticed on
2026-09-03, by reading.

The finding belongs here and not in a footnote, because it incidentally
demonstrates what 3.8 claims: **a body of rules ages with its environment.** The
rule was right on 2026-08-20 and was written out of real damage. The environment
changed, the rule did not. **A rule does not report that it has stopped being
true; it goes on being enforced.**

**And the check was the reason nobody saw it.** The responsible guard required
the string `KEINE WERKZEUGE` to appear in the instruction. It thereby pinned down
a **wording** instead of an assurance and kept alive precisely the rule that had
become false. It was green the entire time. That is the more uncomfortable half
of the finding: not only the rule aged, its guard did too, and the guard had even
protected the ageing.

Repaired on 2026-09-03. The rule now states only what holds in **every** mode:
you cannot write, and you claim nothing you have not done. What may currently be
read is stated by the tool notice, which travels with the workbench. **That is
exactly the rebuild a principle does not need:** *"claim nothing you cannot
evidence"* holds with tools as without. The rule names the case, the principle
the purpose, and only the case goes out of date.

### 3.3 The five principles

1. **What does the next person get out of this?**
2. **Better slow than wrong. So that others do not have to redo it.**
3. **A check that agrees with you is the place where you have to look most
   closely.**
4. **A guessed figure sounds exactly like a measured one.**
5. **A named gap is work, a concealed one is damage.**

Two properties matter more here than the wording.

**They are in Markdown, not in code.** The operator is not a programmer. What
guides the crew he ought to be able to change without asking anyone; otherwise
the stance belongs to whoever touches the code and not to whoever answers for the
work.

**If the file is missing, the shift runs on, but it says so.** That is a
deliberate construction: a silent omission would be the worst of both, the
principles have no effect and nobody notices why the work looks different from
usual.

### 3.4 A building rule that rules do not know: the saturation limit

The principle file carries an upper limit: **at most seven.** If one is added,
one has to go or two have to be merged. The reason stands in the file itself:

> Every mishap likes to add a line. After thirty shifts there would be a wall
> here that nobody processes any more, and then nothing works at all, because
> everything looks equally important.

That is the sharpest difference between the two channels, and it is not spelled
out in the literature cited: **rules add up, principles dilute.** Two hundred
rules are unwieldy, but each individual one goes on working. Twenty principles
work worse than five, because attention is a bounded quantity and a principle
does nothing other than steer it.

From this follows a practical prescription that makes the principle channel a
**maintained** good rather than a growing one: a principle that over many runs
never appears in a single hand-over note is either superfluous or unclearly
worded, and both are a reason to look at it rather than to leave it standing.

### 3.5 The principle is the ground of the rule, and the order deceives

Here stands the relation between the two channels, and it is **not symmetrical**.
They are not two instruments of equal rank to choose between.

> **The principle is the ground. The rule is its narrowing to a case.**

Every rule serves a purpose, otherwise it would be arbitrary. "No key in plain
text" serves the protection of whoever uses the application. "Invent nothing"
serves whoever relies on the output. **One can ask any sensible rule what it is
for, and the answer is always a principle.** The reverse does not work: no
particular rule follows from a principle, but many possible ones.

#### Two directions that must not be confused

The confusing part is that the two directions **run opposite ways**.

| | **Justification**: what warrants what | **Origin**: what came first |
|---|---|---|
| Order | **principle → rule** | **incident → rule → principle** |
| Example | "whoever relies on you must be able to rely on you" warrants "invent nothing" | on 2026-08-20 an estimated figure is exposed → rule → only afterwards the sentence about guessed figures |
| Who knows it | whoever thought the purpose through | anyone who reads the history |

In practice it almost always runs as in the **right** column: something goes
wrong, one writes a rule against it, and only later, sometimes never, does anyone
articulate what the case was a case of. That is why it looks from the inside as
if the rule were the original and the principle the later generalisation.

**That is deceptive.** The purpose was there the whole time; it was merely
unspoken. The rule would not have been recognised as right had someone not
silently known what it was good for.

#### What this explains, and it is a good deal at once

As soon as the direction of justification is taken seriously, several
observations of this paper coincide:

**A rule is always a proxy.** It picks out a purpose and makes it checkable by
narrowing it to a condition. That is exactly why it can be **satisfied without
being met** (3.8): the proxy is not the thing. And that is exactly why Goodhart's
law applies (2.5): *when a measure becomes a target, it ceases to be a good
measure*. The sentence only makes sense if there is something else behind the
measure that it is meant to serve.

**A rule ages, a principle does not** (3.8). The purpose remains, the environment
changes, and the narrowing no longer fits. Only what was cut to a moment in time
can go out of date.

**A rule and a principle can have the same wording** (case 1 in 3.6) and work
differently. No longer a puzzle: it is the same purpose, once spoken as a ground,
once sharpened into a condition.

**And the error in 7.10 gets a name.** Whoever derives "principles" directly from
incidents travels along the direction of origin and takes the result for the
direction of justification. He skips the question of what for, and gets a
sentence that sounds general and is narrowly conceived.

#### Why two channels at all, then?

If the principle is the ground: why not principles only?

Because a purpose is **not verifiable** and a system has nothing that pursues it
of its own accord (1.2). The rule is the part of the purpose that can be **fixed,
checked and demanded**. It is the price for the fact that the purpose cannot be
grasped directly.

This states the thesis of this paper more precisely than the abstract does:

> **Rules and principles are not two instruments to choose between, but a purpose
> and its sharpening.** Whoever takes only rules has sharpenings without the
> ground that made them right, and therefore cannot bring them along when they
> stop fitting. Whoever takes only principles has the ground without anything to
> fasten it to.

#### Two terms, and the direction is in the name

This allows one to name what is to be built and what is not:

| Term | Direction | Verdict |
|---|---|---|
| **Principle-based rule** | principle → rule | ✅ **the right form of construction.** The purpose is fixed, the rule sharpens it to a case, and it can be brought along when the case changes, because the purpose is known. |
| **Rule-based principle** | incident → rule → "principle" | ❌ **the error.** It sounds general and is narrowly conceived: it can only cover what has already happened (7.10). |

**Each of the six rules in 3.2 ought to be a principle-based rule.** That is not
a matter of style but the condition for being able to maintain them: a rule whose
purpose nobody can name can neither be adapted nor struck on grounds. It can only
be followed or forgotten.

#### A maintenance rule that follows immediately

It is the most practical conclusion of the whole section:

> **For every rule, the principle it serves must be nameable.**

If none can be found, one of two things is the case: the rule is superfluous, or
the principle behind it was never spoken and is missing from the other channel.
**Both are findings, and both are machine-detectable** once the mapping is
carried along (7.10).

---

### 3.6 Why a system decides one way or another: four cases carried out

The two drivers from 1.1 are a picture. Here are four cases from operation, the
same situation, seen once through each channel, with what actually happened.

---

**Case 1 · The figure nobody recomputed**

*Situation:* A role is to report how much storage the clones occupy. It does not
know the figure.

| | What the system does | Why |
|---|---|---|
| **Rule only** | writes "I do not know the figure", or writes down a figure if one seems plausible to it | The rule forbids **inventing**. A figure the role takes to be derived does not feel like inventing. |
| **Principle only** | asks: *is this figure measured or derived?*, and marks it | The principle is aimed not at the output but at **checking one's own source**. |

*What actually happened:* "a good thirty clones, several gigabytes". In truth
five clones with 199 MB. The rule was there. It did not bite, because the role
did not have the feeling of inventing anything.

**The key sentence of this case:** rule and principle carry the **same wording**
here and still decide differently, because the rule binds the *output* and the
principle the *attention*. It is not the wording that decides, but the channel.

---

**Case 2 · The check that was satisfied**

*Situation:* A role has built something, runs a check, the check is green.

| | What the system does | Why |
|---|---|---|
| **Rule only** | reports: checked, green, done | There is **no rule** that would forbid this, and there cannot be one. A rule "check whether your check measures anything" would need a feature by which blindness can be recognised. If that existed, it would be the check. |
| **Principle only** | looks again precisely there, *"a check that agrees with you is the place where you have to look most closely"* | The principle puts a **question to the situation** that needs no anticipation of the case. |

*What actually happened:* three findings on a single day: a search that found its
own documentation · a count that counted invisible entries · a check that only
measured that something came back at all. **All three in the check, none in what
was checked.**

**This is the case no body of rules reaches.** It is the strongest evidence that
the principle channel can do something the rule channel cannot, and at the same
time the reason why this ability is so hard to measure: it shows only in errors
that nobody else would have found.

---

**Case 3 · The half-finished hand-over**

*Situation:* A role passes on work that is still missing something.

| | What the system does | Why |
|---|---|---|
| **Rule only** | fills the hand-over field, with "fits" | The rule requires **that** the field be filled. It cannot require the content to be of use. |
| **Principle only** | writes down what is missing and what the next person has to do about it | *"What does the next person get out of this?"* cannot be answered in one word. |

**This is Schuett et al.'s "box-ticking", in miniature and literally.** A
satisfied rule and a useless result, at the same time. In the experimental setup
(7.4) this class of error gets a category of its own: *empty hand-over*, because
it is to be expected only in arm R.

---

**Case 4 · The claimed execution. Both fail**

*Situation:* A role is to report whether code works. It has no tools and cannot
know.

| | What the system does |
|---|---|
| **Rule only** | There is a rule, explicitly, with the incident in its wording. **It did not bite.** |
| **Principle only** | Principle 5 covers the case completely: whoever could not check writes that down. **It did not bite either.** |

*What actually happened:* "Sten ran the code through." On 2026-08-20.

**This case is the most important of the four**, because it cuts both ways. It
shows that the answer to "which is better" is not "principles". It is that there
are situations in which **neither channel achieves anything**, because a claim
about reality cannot be checked against the claim. There neither a sharper rule
nor a better principle helps, only a change to the setup: give the role tools, or
do not ask the question in the first place.

---

### 3.7 What can be derived from this as a rule of thumb

Not as a result; as a working hypothesis that the experiment in section 7 is
meant to test:

| Take a **rule** when … | Take a **principle** when … |
|---|---|
| the case can be described completely | the case is unknown or forms a family |
| compliance is **checkable** | compliance shows only in the result across many cases |
| a single breach does harm | the sum of many small slips does harm |
| it is about **form** (secrets, addresses, schema) | it is about **judgement** (when is something finished, what is enough) |
| someone is there who **maintains** the rule set | nobody is there to maintain it (3.8) |

**And the case in which neither helps:** when the claim is not verifiable. Then
it is not a steering problem but one of the setup.

### 3.8 Durability: the property that weighs most

Up to here it was about **reach**, which channel gets to which case. There is a
second property that weighs more in operation and appears only in passing in the
literature cited: **how well does what one has written down hold?**

#### A rule is read by the very thing it is meant to bind

That is the asymmetry at issue, and it distinguishes the rule channel of a
language model from every body of rules before it.

A rule in a program barrier is **executed**. It tests a condition, and the
condition is true or false. A rule in the text a language model is given is
**read**, and read by the same system it is meant to constrain. Afresh on every
run.

Every rule is thereby also a **surface of attack**: it is a condition, and every
condition has an edge. An edge is a place where one can stand just inside. That
is exactly what the *specification gaming* of section 2.5 is about. The boat
driving in circles broke no rule.

**A principle has no such edge.** "What does the next person get out of this?"
cannot be satisfied on a technicality, because there is no technicality. The
question can be passed over, but it cannot be **technically passed**.

This allows the objection to be put more precisely:

> **A rule can be satisfied without being met.
> A principle can be passed over without being violated.**

Both are failures. But they are **different** failures, and the rule failure is
the more dangerous one: it is **systematic**. Whoever finds the edge of a
condition finds it again reliably. A principle passed over, by contrast, is
negligence. It repeats, but it does not compound.

#### A body of rules ages, a principle does not

Schuett et al. (2024) mention it in passing, and it is the practically most
important sentence of their weighing: specific rules **age quickly**.

The reason is the same as in Kaplow: a rule contains the world as it was at the
moment of writing. If the environment changes, the rule points into the void or
at the wrong thing, and nobody notices, because it goes on being satisfied.

A principle contains no state but a purpose. "A guessed figure sounds exactly
like a measured one" was right in March and is right today; there is nothing in
it that could go out of date.

|  | **Rule** | **Principle** |
|---|---|---|
| Binds | a condition | a purpose |
| Has an edge one can stand just inside | **yes** | no |
| Goes out of date when the environment changes | **yes** | no |
| Must be extended for every new case | **yes** | no |
| Loses effect when too many stand beside it | no | **yes** (3.4) |
| Verifiable | **yes** | no |

#### The sentence it comes down to for a small operator

> **A body of rules is a maintenance obligation. A principle is not.**

For an organisation with a legal department that is a matter of cost. For a
single operator it is the question whether the steering **stays alive at all**. A
rule set that is not maintained does not become neutral. It becomes creepingly
wrong, and inconspicuously so, because all the checks stay green.

That is precisely why the principle channel exists here. It was not meant as the
more elegant thing but as the thing that still carries without maintenance.

#### And the price paid for it

This durability is **bought**, not given. What has no edge also has no border
along which one could measure. A principle holds longer **because** it fixes
nothing, and for the same reason it is not verifiable.

**Durability and verifiability cannot be had in the same channel.** That is the
version of this paper's thesis that sounds least like a compromise and explains
the most: the two channels are not two flavours but two ends of a trade in which
one cannot decide for one side without losing the other.

#### What that means for the experiment, and what it cannot test

The durability thesis is **longitudinal**: it predicts that the gap between R and
G **grows over time**, because the rule set ages and the principles do not.

**The experiment in section 7 cannot measure that.** It runs over weeks, not
years, and in that time no rule set goes out of date. What it could measure would
be a substitute: **the same runs with a deliberately outdated rule set**, one
that fitted an earlier version of the system. Whether that measures more than the
handling of an error is open and is not claimed here.

### 3.9 Compression: one principle replaces several rules, and what that costs

From the direction in 3.5 something practical follows that was missing so far. If
a rule is the sharpening of a purpose, then **several rules can sharpen the same
purpose**, each onto a different case. And then they can be replaced by **the one
principle** they all come from.

The six rules from 3.2 show it. "Invent nothing", "do not claim to have executed
something" and the honesty rule about one's own state are three sharpenings of
**one** purpose: *whoever relies on an output must be able to rely on it.* Three
lines, one ground.

#### Why that is really money in operation

In a person, compression would be a question of clarity. Here it is a question of
cost, and an immediate one:

**The instruction block travels with every call.** Five roles per shift, each gets
both channels, several times per shift. What stands in the block is **paid for a
hundred times**, not once.

A question of style thus becomes a calculation. An operator without a budget pays
for every superfluous line again on every run. **And it hits precisely the small
ones**: whoever runs many passes pays a lot; whoever fears the regulator would
rather write one rule more than one less, and pays for both together.

#### And the saturation limit points the same way

By 3.4, twenty principles work worse than five, because attention is bounded. If
that also holds for the block of rules, and section 2.4 suggests the two channels
compete for the same budget, then compression would be **doubly** right: it saves
money **and** works better.

That would be the pleasant case. It is also the one where one has to look most
closely (principle 3), because it sounds too good.

#### Three counterweights, without which the sentence is false

**1 · Compression is lossy.** A principle that replaces five rules no longer
**enforces** those five cases. It only points at them. One trades **enforcement
for reach**. That is exactly the trade from 3.8, here seen from the cost side.

**2 · Some rules must not fall away.** The rule of thumb from 3.7 says which:
where **a single breach** does harm. A key in plain text is once too often. For
"no secrets", "no external addresses" and the schema breach the rule stays; the
principle beside it does not replace it but grounds it.

**Compression is therefore not uniformly applicable.** It bites where the harm
arises from the **sum** (empty hand-overs, unevidenced figures, repetitions), and
not where it arises from the **single case**.

**3 · A shorter block is not automatically cheaper.** It is cheaper **per call**.
If more runs fail as a result and have to be repeated, the calculation can
reverse. **The right size is not the price per call but the price per usable
result**, and that is a measurement, not a derivation.

#### A worked example, and it turns out otherwise than expected

The principle that carries several rules can be named. Three of the six rules,
*honesty first*, *invent nothing*, *you have no tools*, serve the same purpose:

> **Whoever relies on your output must be able to rely on it.**
> Write down only what you actually know. What you could not check, you mark as
> unchecked. A guessed figure sounds exactly like a measured one.

**Measured, not estimated** (character count on the wording in
`WERKSTATTREGELN.md`, as of 2026-08-23, block of rules 1,572 characters):

| | Characters |
|---|---|
| The three rules together | **938** |
| The one principle that carries them | **224** |
| **Saving per call** | **714**; the block of rules shrinks from 1,572 to 858 characters, that is by **45 %** |

> ⚠ **Until 2026-09-03 this read "from 1,510 to 796 characters, that is by
> 47 %".** The three individual values were measured correctly and can be
> recomputed; the **total** was not. On no documented day did the block have
> 1,510 characters: the source file shows 1,505 early on 21 August, 1,572 late on
> 21 August, and 1,723 since 3 September. Noticed by recounting, not by reading.
> **A figure assembled from correctly measured parts is therefore not itself
> measured.**

The conversion into tokens is an **estimate** and marked as such: for German
prose roughly 3 to 4 characters per token, so **about 180 to 240 tokens** per
call. *The exact figure comes from the `count_tokens` endpoint; it is to be
measured before any figure is asserted anywhere.*

**And now the calculation, at roughly 200 tokens per call and 5 USD per million
input tokens:**

| | |
|---|---|
| Calls needed to save **1 million tokens** | about **4,900** |
| Value of that million | **5.00 USD** |
| One shift (5 roles, 3 calls each = 15) | **3,060 tokens** saved |
| Value per shift | **0.015 USD** |
| … with the block cached (about a tenth) | **0.0015 USD** |

#### The objection that finally overturns the calculation: the model has to interpret

Up to here only the **input** was counted. But there is a counter-direction, and
it is the stronger one.

**A rule says what to do. A principle says what for, and leaves open what that
means in the case at hand.** So the model has to take that step itself: it has to
interpret what the purpose amounts to here. Interpreting means thinking, and
thinking is **output tokens**.

And those cost five times as much: with Claude Opus 5, **5 USD** per million
input tokens stand against **25 USD** per million output tokens.

That gives the break-even point:

| | |
|---|---|
| Saving per call (204 input tokens) | **0.00102 USD** |
| Price of one output token | **0.000025 USD** |
| **Break-even** | **41 additional output tokens per call** |

**Forty-one tokens are about twenty-seven German words, one or two sentences of
thinking.** If the model thinks even that much longer on account of the
principle, the entire saving is used up.

**And with a cached block it becomes devastating:** there the input costs about a
tenth, and the break-even falls to **four output tokens**, less than half a
sentence.

#### This is Kaplow's cost of application, measured in tokens

This finding is not new, it has only never been measured this way. Kaplow (1992)
has been saying it for over thirty years:

> **Rules are expensive to set and cheap to apply.
> Standards are cheap to set and expensive to apply.**

In people, the cost of applying a standard is the time a judge needs to weigh
things up. Here it is **the same quantity in another currency**: the tokens the
model spends on interpretation.

**The calculation above counted only one half**: the setting, that is, the bytes
in the block. The other half, the applying, sits on the output side and costs
five times as much per token. Whoever measures only the input measures the half
that agrees with him.

**The compression thesis is therefore not merely small but possibly negative**,
and whether it is, is a measurement and not a derivation.
The experiment in section 7 can carry it out: input and output tokens are
recorded per run anyway, the arms differ precisely in block length, and the
comparison is a subtraction.

> **Prediction that can be wrong:** arm G has the lower input cost and the
> **higher** output cost. Whether the sum lies below or above that of R+G is
> decided by a value that turns at forty-one tokens, that is, at a very small
> number.

#### The result refutes the obvious expectation

**The saving is tiny.** Whether any remains after the section above is not
measured. One and a half cents per shift on the input side, a tenth of that with
caching, and on the output side a break-even at forty-one tokens. Against a shift
cap of five euros that is nothing.

The comparison that places it:

> **A single avoided failed shift corresponds to about 327 shifts of block
> compression**, with a cached block about **3,268**.

**The frugality thesis in its simple form is thereby refuted**, and by its own
calculation. Whoever justifies compression with "it saves computing power"
justifies it wrongly: at this scale of operation the block size is simply not the
item that matters.

**Two things nevertheless stand**, and both are more important than what was
refuted:

**1 · Compression works through quality, not through bytes.** If a shorter,
clearer block saves even **one in three hundred** shifts from failing, it has paid
for itself, and a hundred times more than through the tokens saved. **That is
precisely why the target quantity is "cost per usable result" and not "cost per
call"** (7.4). This calculation is the evidence that the choice of target
quantity was right, and not merely cautious.

**2 · And the calculation belongs on the other side anyway**, see below: it is
not the instruction that costs, but the work.

**3 · The order of magnitude flips with scale.** At fifteen calls per shift it is
nothing. In a service with many users and millions of calls the same saving is
real money. **For the small operator this paper is about, it does not hold**, and
that is exactly the kind of distinction that is lost when a figure is carried over
from another scale without recomputing it.

> **The lesson of this section is methodological, not substantive:** the frugality
> thesis sounded compelling but did not survive the first calculation. It stands
> here in full together with its refutation, because a paper that shows only the
> confirmed conjectures describes its selection and not the matter.

#### The calculation from the right side: it is about output, not input

Everything in this section so far looks at the **input**: how long the instruction
block is. That was the wrong side, and its own calculation shows it: the saving
there is one and a half cents, the break-even lies at forty-one tokens.

**The money is on the output side.** It is not the instruction that costs but the
**work**: every detour, every failed attempt, every round that has to be repeated
because the result was not usable. And output tokens cost five times as much.

The real question is therefore not *"how do I shorten the instruction?"* but:

> **Does the steering get to the goal faster?** Fewer detours, less rework, fewer
> discarded runs, that is, **fewer output tokens for the same usable result**.

The comparison in figures, against a shift cap of five euros:

| By what | Effect per shift | relative to compression |
|---|---|---|
| shorten the instruction block by 47 % | 0.015 USD | **1×** |
| **1 %** fewer output tokens | 0.05 € | **3×** |
| **5 %** fewer output tokens | 0.25 € | **16×** |
| **10 %** fewer output tokens | 0.50 € | **33×** |
| **20 %** fewer output tokens | 1.00 € | **65×** |

**The entire block compression corresponds to an improvement in hit rate of 0.31
per cent.** A third of a percentage point. Whoever shortens the instruction and
loses even half a per cent of accuracy has lost, and whoever lengthens it and
gains one per cent has won.

#### What that means for the thesis of this paper

It reorders the whole question, in favour of precision rather than brevity:

**First: frugality is not an argument for principles.** Whoever grounds them that
way grounds them on the smallest item in the calculation. The section above
refutes that with its own figures, and it stays refuted.

**And what accuracy would come from is a separate question**; three possible
causes and the two controls that separate them stand in 3.10.

**Second: accuracy is the only argument that carries**, for whichever channel.
Whether rules, principles or both clear the shorter path to a usable result is
the question everything hangs on. **And it is open.** A principle can save
detours, because it names the purpose and does not pin the model to a case that
is not present. It can also **create** detours, because it has to be interpreted
(Kaplow's cost of application above).

**Third, this ends the dispute about block length before it begins.** One does not
have to weigh "short enough" against "precise enough": at this ratio precision
**always** wins. An instruction three lines longer that shortens the path by one
per cent is the better instruction, even if it reads as wasteful.

> **The sentence that remains from this whole section:**
> **Never shorten the instruction in order to save. Shorten it only if it becomes
> clearer thereby, and measure whether the path to the goal has got shorter.**

And the quantity that measures the path to the goal is simpler than it sounds:
**how often does the first result have to be corrected?** The next section works
it through. It is countable rather than a matter of judgement, it drives the cost
directly, and a jump from 30 to 50 per cent first-time solutions outweighs the
entire block compression **a hundred and nine times over**.

That is why the experiment in section 7 measures **output tokens per usable
result** and not block length. Block length is still recorded, but as a secondary
quantity, not as the target.

#### The main measure: how often does it have to be corrected?

If it is about the path to the goal, then the quantity that measures it is as
simple as can be:

> **How often does the first result have to be corrected before it is usable?**

That yields two figures:

- **First-time solution rate**, the share of tasks where the **first** output was
  already usable.
- **Correction rounds to the goal**, the mean across all tasks.

**Why that is the better measure than everything proposed so far**, and for four
reasons at once:

**1 · It drives the cost directly.** Every round is a full pass. Two rounds
instead of one double the output tokens, three triple them:

| Rounds to the goal | Output tokens | at a shift cap of 5 € |
|---|---|---|
| 1 | 1× | 1.67 € |
| 2 | 2× | 3.33 € |
| **3** | **3×** | **5.00 €** ← today's cap |
| 4 | 4× | 6.67 € |
| 6 | 6× | 10.00 € |

**2 · Small improvements are immediately large.** Assume that whoever misses the
first time needs two further rounds on average:

| First-time solution rate | mean rounds | Output tokens |
|---|---|---|
| 30 % → 50 % | 2.40 → 2.00 | **17 % fewer** |
| 50 % → 70 % | 2.00 → 1.60 | **20 % fewer** |
| 30 % → 70 % | 2.40 → 1.60 | **33 % fewer** |

A jump from 30 to 50 per cent saves **1.67 € per shift. A hundred and nine times
the entire block compression.**

**3 · It is countable, not a matter of judgement.** And that solves a problem left
open in section 7.9: the machine cannot say which output is *better*, but it can
**count how often it was corrected** before someone accepted it. That gives a
quantity closely tied to quality that still gets by without a verdict.

**4 · It is what the operator actually feels.** Not tokens, not percentages, but
how often he has to send something back.

#### The catch, and it is serious

**The acceptance signal is itself a judgement.** Someone has to say: *that will
do.* With that, appraisal comes back through the side door:

- **If the crew's own checker judges** (the role that checks inside the setup), it
  is again a check that agrees with itself.
- **If the operator judges**, it is a human being, but the same one who wrote the
  principles, and he knows which arm the run came from.

**Two ways to defuse this**, and both are cheap:

1. **Fix the acceptance criterion in advance**, as narrowly as possible. What has
   to be there for it to count? A criterion fixed beforehand is half a measure; an
   impression formed afterwards is none.
2. **Blind it** as in 7.5: whoever judges sees the run, not the arm. Together with
   the procedure from 7.9 it can even be proved that he could not see it.

**What remains**, and it belongs written down: the round count is an
**approximation of quality**, not a substitute. It measures how quickly something
was accepted, not how good it was. A lenient checker produces a splendid
first-time solution rate and poor results. **That is why it is read together with
the error categories from 7.4 and never alone.**

#### What follows from this for the experiment

The experiment thereby gains an **economic target quantity** alongside quality,
and it is measurable with the existing setup: Kimhub carries cost and duration per
run anyway.

| Quantity | From where |
|---|---|
| Length of the instruction block per arm | countable, before the run |
| Cost per run | already recorded |
| Share of usable results | from the error categories (7.4) |
| **First-time solution rate** | countable: was the first output usable? |
| **Correction rounds to the goal** | countable, and drives the cost directly |
| **Output tokens per usable result** | **the actual measure** |

And the prediction that follows, and that can be wrong:

> **Arm G has the shortest instruction block and the lowest cost per run.**
> Whether it also has the lowest cost **per usable result** is decided by whether
> the quality holds. If it does not, R+G wins despite the longest block, and then
> compression is a saving one pays dearly for.

**Why this figure counts beyond the paper:** it answers a question that is
practical for every small operator and for no large one: *can an AI system be
steered such that it can be operated without a budget?* Whoever runs many passes
and has no legal department is not saved by better rules but by fewer of them.
Whether that is so, nobody has yet looked into.

---

### 3.10 Why, though? Three causes that can be separated

Suppose the principles really do reduce errors: **what is it down to?** So far
this paper describes **that** the channels differ, not **by what**. Three
explanations suggest themselves, and the difference between them is not academic:
they predict **different things**, and by that they can be told apart.

**H1 · It thinks differently. Purpose instead of condition.**
A principle names the what-for. The model then does not check whether a condition
applies but works towards a goal. *Prediction:* the advantage is greatest for
**new** cases (task type E) and smallest for circumscribed ones (type B), exactly
the pattern from 7.3.1.

**H2 · It has less ballast to read.**
A shorter block leaves more attention for the actual work. That is the saturation
conjecture from 3.4, seen from the effect side. *Prediction:* the advantage
depends on the **length** of the block, not on its **content**.

**H3 · A principle covers cases for which no rule was written.**
That is Kaplow's point, unchanged. *Prediction:* the advantage shows exclusively
in errors **outside** what the rules cover; inside, the rule arm ought to be level
or better.

#### The control that separates H2 from H1 and H3

It is cheap and decides more than any other measurement in this paper:

> **A fourth arm with length-matched filler.** The principle block is padded with
> irrelevant but harmless text to the same length as the rule block.
>
> - **If the advantage disappears**, it was the length. **H2**.
> - **If it remains**, it was the content. **H1 or H3**.

Without this control, length and content are confounded in every result, and one
can say whatever one likes.

#### And the classification that separates H1 from H3

Every error found is additionally classified by whether it lies **inside** or
**outside** the area the six rules cover. That is decidable, because the rules are
finite and written down.

- If the advantage shows **only outside** → **H3**, coverage.
- If it shows **inside as well** → there a rule applies and still does not do as
  well as a principle. That would be **H1**, and it would be the most interesting
  finding of this paper: then it would not be down to reach but to how a purpose
  works differently from a condition.

#### A conjecture that stands before the measurement

The objection was *"not having to read thousands of rules first"*. **In this setup
they are not thousands but six. 1,723 characters** (as of 2026-09-03; 1,572 before
the repair of the sixth rule). At that size **H2 is implausible**: a block of
fifteen hundred characters binds no appreciable attention.

That does not mean H2 is false. It means it **cannot bite here** and would become
measurable only in a system with a really large body of rules. There, however,
probably strongly. **Whoever carries this work over to a large installation should
reckon with H2; whoever measures it here will not find it.**

This conjecture stands here expressly **before** the measurement, and it is to be
measured more precisely in the experimental setup than so far. If it does not
hold, that is no mishap: a prediction fixed in advance is the only part of this
work that can be refuted at all.

#### They do not exclude one another

It is possible that all three contribute something. **That is not a defect of the
setup but the reason for building it this way:** the two controls above apportion
the contribution instead of crowning a winner. A paper that looks for *the* cause
mostly finds the one it expected.

---

## 4 · Observations

### 4.1 Rules bite reliably where the case was foreseen

Over the entire period no run has emitted a key, a token or an external address.
Those are cases that can be formulated completely, and there rules do exactly what
one expects of them.

What is remarkable is not that it works, but **how narrow the area is** in which
it works: it ends where the check ends.

### 4.2 Principles do not fire: they shift a threshold

The sentence comes from the principle file itself and is the most precise
formulation this paper has to offer:

> **Principles do not fire the way rules do; they shift a threshold.**

A rule bites or does not, and one sees it in the individual case. A principle has
no visible effect in any individual case. It changes **where** someone draws the
line between "done" and "not yet", between "enough" and "not enough".

From this follows a methodological problem this paper does not solve: **the effect
of a principle cannot be read off a single output.** What could be read off would
be distributions over many runs, and those were not collected here.

### 4.3 A principle proved itself on the day it was adopted

The best-documented single case, with a date. On 2026-08-20 principle 4 ("a
guessed figure sounds exactly like a measured one") was written down. On the same
day it became apparent that a measured quantity, the self-preference of a role in
its own assessment, reported as −1.15, **was no measurement at all**: it was the
consequence of an instruction in the prompt that required judging one's own
proposal more strictly. The instruction was removed; since then the figure
measures something again.

That is the class of error against which a rule achieves nothing. One would have
had to formulate it as: *"check whether a reported measurement is not in truth the
consequence of an instruction"*, and one only arrives at that **after** it has
happened. That is exactly Kaplow's point about the incompleteness of any
rule-making, on a very small example.

### 4.4 The hardest limit was not planned and lies in neither channel

The roles do not see the repository. They are given text and return text. So they
regularly propose things **that already exist**.

Neither a rule nor a principle remedies that. What is missing is not will and not
stance, but **access**. That is a finding against the author's own expectation: he
built the setup in order to distinguish rule from principle, and the strongest
limitation lay in a third quantity that does not appear in that distinction at
all.

From this a second path emerged: the same five roles in one session **with**
access to the existing stock. This path too carries an expressly named weakness:
five roles in one head are not five opinions. It is marked as an intermediate
step, not as a solution.

---

## 5 · Where both fail: the actual finding

### 5.1 The rule that remained a request

There is an explicit rule: *"You have no tools. Therefore NEVER write that you or
anyone else has executed, checked, run or measured anything."* It carries with it,
in its wording, the incident it arose from.

On 2026-08-20 the report read: **"Sten ran the code through."** That had not
happened and could not happen.

The rule is thus a **damper, not a bolt**. And the reason is structural, not
remediable by better wording: a rule is enforced by someone checking whether it
was kept. **Whether a sentence about reality is true cannot be checked against the
sentence.** Here ends what rules can achieve at all, not through negligence but by
construction.

### 5.2 The principle that did not bite

The same incident is also a failure of the other channel. Principle 5 ("a named
gap is work, a concealed one is damage") covers the case completely in substance:
whoever could not check writes down that he could not check. The principle was
there. It had no effect.

**That is the observation that separates this paper from a piece of advocacy for
principles.** Whoever reports only the cases in which a principle helped describes
his selection and not the matter.

### 5.3 What follows

The two channels fail at **different** points:

| | Bites reliably | Fails |
|---|---|---|
| **Rule** | where the case was foreseen and compliance is checkable | where the check itself is impossible (claims about reality) |
| **Principle** | where nobody looked in advance | where attention does not stretch, and without any feedback that it did not bite |

The limits do not overlap completely, and neither is a subset of the other. That
is why the question "which is better" cannot sensibly be put, and why the two also
cannot be considered separately.

**And the limits do not run along the wording.** Case 1 in section 3.6 shows two
instructions with **the same words**, once as a rule and once as a principle, that
decide differently: the rule binds the **output**, the principle the
**attention**. Whoever wants to sort the two channels by their content sorts by
the wrong feature. **It is not the wording that decides, but the channel.**

---

## 6 · What is expressly not proved here

This section is the more important part of the paper.

- **No control group.** No run *without* principles was ever set against one
  *with* principles. The setup could do it; the loading function reports
  explicitly when the file is missing instead of running on silently. It was not
  done.
- **No measure.** "The work looks different" is not a result as long as nobody has
  said by what one recognises *different*.
- **Sample of one.** One operator, one network, one shape of task.
- **Not blinded.** The same person wrote the principles, triggered the runs and
  judged the results.
- **Model changes not controlled.** Over the observation period the models used
  changed. What of this is principle effect and what is model effect is **not
  separable** with this setup.
- **Part of the evidence comes from dry runs**; their cost figures are computed,
  not paid, and are marked as such.

**What follows:** a field observation with a record, not a proof. Usable as a
starting point, not as evidence.

**The next section is therefore not a wish list.** The experiment described can be
built on the existing setup, it is planned, and it contains the prediction on
which this paper can fail.

---

## 7 · The experimental setup: three arms, and thereby refutable

The setup from section 3 can be turned into an experiment without rebuilding. The
proposal comes from the operator (2026-08-23) and is better than the obvious
two-arm comparison, because it makes the thesis of this paper **testable** for the
first time.

### 7.1 Three arms instead of two

| Arm | What the crew gets |
|---|---|
| **R** | the rules only |
| **G** | the principles only |
| **R+G** | both, today's operating state |

A two-arm comparison (with/without principles) could only show **that** the
principles change something. The third arm is the decisive one: it tests whether
the combination achieves more than the better of its parts.

To this comes a second axis, the **type of task** (7.3). Only both together give a
prediction that cannot be talked up.

### 7.2 The prediction, and what would refute it

From the thesis of this paper ("both do different things, neither is enough on its
own") follows an expectation to be recorded **before** the runs:

> **R+G is better than R and better than G.** And: **R and G make different
> mistakes**, not the same ones in different numbers.

That is not a formality but the point at which this paper can be wrong. Three
results would refute it:

- **R+G is level with the better single arm** → the channels overlap, one is
  superfluous.
- **R+G is worse than both** → too much instruction dilutes, and the saturation
  limit from 3.4 holds for the sum of both channels too.
  **For this outcome there is a named mechanism** (2.4): crowding out in the sense
  of Gneezy and Rustichini. It is not merely conceivable but documented in people,
  and in people it was **not reversible**.
- **R and G make the same mistakes, only in different numbers** → then the
  difference is one of degree and not structural, and the whole separation is
  description rather than explanation.

**The third would be the heaviest blow** and is at the same time the most
plausible counter-result. It belongs written down expressly, before measuring.

### 7.3 Three task types, and why that is what sharpens the prediction

The operator's second proposal (2026-08-23): vary not only the steering but also
the **type of task**.

| Type | What the crew gets | How open is the case? |
|---|---|---|
| **E · Own idea** | a goal, nothing else | **completely open**, nobody looked in advance |
| **V · Template** | a predecessor's work as a starting point | partly mapped out |
| **B · Improve what exists** | something already built, with the question whether it can be done better | **narrowly circumscribed**, the case is at hand |

**That is not an extension but the actual touchstone.** The core of this paper is
Kaplow's point: **a rule covers exactly the case someone wrote it for.** From
which it follows immediately that its advantage must depend on **how foreseeable
the case was**. And that can be set.

### 7.3.1 The prediction thereby gains a direction

Three arms × three task types yields not merely a finer table but a claim that is
markedly easier to refute than "R+G wins":

> **The gap between G and R is largest for type E and smallest for type B.** It
> ought to fall **monotonically** across E → V → B.
>
> For type **B**, R could even come out ahead of G: the case is circumscribed, the
> rules bite, and principles bring little where there is nothing left to guess.

A ranking (R+G in front) could be read out of almost any result with enough good
will. **A trend across three steps cannot.** If it runs flat or in the wrong
direction, the thesis about foreseeability is refuted, and that independently of
which arm comes out ahead overall.

### 7.3.2 Type B additionally measures something no other arm can

The strongest single finding from section 4.4 was involuntary: the roles do not
see the stock and therefore propose what already exists. **Task type B puts the
stock expressly before them.** That separates what was previously confounded:

- If a role proposes something existing **even when** it lies before it, it is a
  problem of attention. There principles bite.
- If it proposes it **only** when it cannot see the stock, it was never a steering
  problem but one of **access**, and neither rule nor principle would ever have
  achieved anything.

That is the point at which the experiment answers something the field observation
could only name.

### 7.3.3 The price

Three arms times three task types are **nine conditions**, each to be repeated
several times. That is a multiple of the two-arm comparison, and it costs real
money per run.

Two ways out are open, and both belong decided beforehand, not along the way: run
the experiment **in stages** (first E against B as the two extremes, V only
afterwards), or lower the number of repetitions per condition and **write
expressly** that the claim is weakened thereby. **What does not work: cutting
along the way and letting the result look complete.**

### 7.4 What is measured: fixed beforehand, not afterwards

A notion of error that arises after the runs measures the expectation of whoever
evaluates. Therefore: **fix the categories before the first run, do not change
them afterwards.** Proposal, derived from the observed classes of error:

| Category | What counts |
|---|---|
| **Invented activity** | claims to have executed/checked/measured something (the case from 5.1) |
| **Unevidenced figure** | figure, date or legal position without a source and without being marked as an estimate |
| **Repetition** | proposes something that already exists in the stock |
| **Concealed gap** | could not do something and does not write it down |
| **Formal breach** | violates one of the hard rules (personal data, secret, external address) |
| **Empty hand-over** | hand-over note without content ("fits", "all good") |

The last two categories carry the distinction in miniature: **formal breach**
should be more frequent in arm G (no enforced rules), **empty hand-over** in arm R
(no stance that presses towards being concrete). If that does not hold, that is
already a finding.

**And the category "repetition" is only meaningful for task type B.** For E and V
the crew does not see the stock. There it measures missing access, not missing
attention (7.3.2). Whoever adds it up across all types mixes two different things
into one figure.

### 7.5 The analysis tool, and the one property it must have

The operator proposes an evaluation tool inside the machine. That is right, and it
has one requirement that stands above all others:

> **The tool must not show whoever evaluates which arm a run came from.**

Without that, the evaluation measures what the evaluator expected, especially when
he wrote the principles himself. Concretely: the runs are shuffled, get anonymous
identifiers, and the mapping to the arm lies in a separate file that is opened
only **after** the assessment.

That is cheap to build and makes the difference between an evaluation and a
confirmation. It is the same discipline as principle 3: *a check that agrees with
you is the place where you have to look most closely.* **And it can be proved
rather than asserted**: how, stands in 7.9.

What else the tool should do: count the six categories per run, output
distributions per arm, and **supply the raw data**: an evaluation whose
intermediate steps nobody can recompute is an assertion with a bar chart.

### 7.6 Fixed criteria for the build

The operator's second proposal: settings in which the rules for the build are
fixed by set criteria. For the experiment that is a **precondition**, not an
accessory. What may change between two runs has to be named, otherwise one is
comparing two different things.

To be recorded per run, by machine and not by hand:

model identifier and version · **arm** (R / G / R+G) · **task type** (E / V / B) ·
the wording of both channels (or its checksum) · the job · for types V and B: what
exactly was presented · time · cost and duration.

**The model identifier is the most important entry here.** The reservation from
section 6, that model changes are not separated from the principle effect, falls
away only if all three arms run on the **same** model version, and demonstrably
so. If the experiment runs over several weeks, that is not a given.

### 7.7 What the experiment still cannot do even then

Three reservations remain, and they remain expressly:

1. **Sample of one among operators.** One network, one shape of task. Blinding
   removes the bias of the assessment, not the narrowness of the field.
2. **The notion of error is set, not derived.** The six categories come from what
   was noticed here. Another field would have others.
3. **The saturation limit remains untested.** Whether seven principles work better
   than twelve is an experiment of its own: the same task with three, five, seven
   and twelve principles. **That would be the first independent contribution to
   theory** this setup could deliver: Kaplow and Schuett et al. do not treat
   saturation, because at their level no budget of attention is in play.

### 7.8 What is missing and is being sought

Points 7.1 to 7.5 can be built; the system brings the preconditions with it (the
principles lie in a file of their own that can be removed, and the system reports
their absence instead of concealing it).

What is missing is the **statistical evaluation**: how many runs per arm are
needed for a difference to mean anything, and how to test it. That is a craft
taught at universities and one the author does not have. For this part a
collaboration is expressly sought.

### 7.9 What the machine itself can prove, and what it cannot

An obvious question: can the system run and evaluate the experiment **itself**?
The answer falls into two halves, and the line between them is sharp.

#### What it structurally CANNOT do

**It cannot judge which output is better.** That demands a verdict about the
purpose, and such a verdict would be a check that agrees with itself, exactly the
case principle 3 warns against. Worse: the assessment would run through the same
model family that produced the output. Section 5.1 shows what comes of that: a
system that, without tools, claims to have checked something.

Just as little can it prove that the **error categories are the right ones** (they
are set) or that a result holds **beyond this field** (sample of one).

#### What it can prove, and without any verdict at all

Five things, all **decidable** rather than judgeable:

**1 · That the conditions really were different.** Which arm, which task type,
which model state, what wording of both channels, each with a checksum. That is
bookkeeping, and at that a machine is better than any person. **Without this
evidence nothing else counts**, because otherwise it stays unclear what was
compared.

**2 · The invented activity, fully decidable by machine.** And that is the most
important point of this section. **The machine knows which tools it handed out.**
If it handed out none, then every sentence claiming an execution is **demonstrably
false**: not a verdict, a fact.

Kimhub can thereby itself demonstrate precisely the error at which **both
channels** failed in section 5. The central finding of this paper is checkable by
machine.

**3 · The remaining decidable categories.** Formal breach (key, external address,
schema breach) is already checked by machine today. Empty hand-over is a question
of content and length. Repetition is checkable for task type B, because the stock
was present as input: there is something to compare against. **Unevidenced
figure** is partly decidable: whether a source was named is settled; whether it
holds is not.

**4 · Repeatability.** The same input, the same arm, run many times: how stable is
the difference at all? That is the question most small evaluations founder on, and
a machine can afford it. **A difference that is as large between two runs of the
same condition as it is between the arms is not a difference.** This counter-check
costs nothing but compute, and it is run first, not last.

**5 · That the blinding was kept: provable, not asserted.** The point that first
makes self-measurement credible.

Instead of assuring that one did not know which arm a run came from while
assessing it, this can be **nailed down**:

1. The mapping run → arm is written into a file that stays **closed**. A checksum
   of it is formed and **published**.
2. Only then are the runs assessed. The assessments are likewise stored and
   published with a checksum.
3. **Then** the mapping is opened.

Whoever recomputes the order sees: the assessment cannot have known the mapping,
otherwise one of the two checksums would not fit. That is not an advance of trust
but a **commitment made in advance**: the same procedure the network works with
anyway when it secures copies against drift.

#### The division of labour that follows

| Question | Who answers it |
|---|---|
| Which arm, which model, which wording? | **machine**, bookkeeping with checksum |
| Was an execution claimed that did not happen? | **machine**, it knows what it handed out |
| Formal breach, empty hand-over, repetition (type B)? | **machine**, decidable |
| Is the difference larger than the noise? | **machine**, repetition |
| Was the assessment really blinded? | **machine**, checksums in advance |
| **Which output is better?** | **human**, and preferably not the author of the principles |
| Are the categories the right ones? | **human** |
| Does this hold beyond this field? | **nobody here**; that needs a second case |

#### Why this division is more than a makeshift

The experiment thereby becomes **cheap and self-documenting**. Everything the
machine takes on costs compute and no attention, and it is precisely the parts at
which human evaluations founder: bookkeeping, repetition, blinding.

What remains is a scarce, expensive good: **an outside verdict on a few
well-prepared cases.** That is exactly what a partner is worth, and exactly what
the request in 7.8 comes down to.

And there is a flip side that belongs to the thesis of this paper: **the machine
can check everything checkable and precisely not the decisive thing.** That is not
a weakness of the setup but the same limit that has been at issue all along; it
merely reappears one level up, at the assessment instead of the steering.

### 7.10 The feedback loop, and why a self-derived principle is none

Section 3.5 describes a sequence: **incident → rule → principle.** So far a human
walks it, after a mishap. The obvious question: can the system walk it itself,
learn from its own results and derive new principles from them?

#### Two steps, and only one of them works

**The recognising works.** By 7.9 the machine can count classes of error per run.
So it can also establish a **pattern**: the same category five times in ten runs,
or a category that appeared only after the wording was changed. That is counting,
not judging, and it is exactly the signal the principle file calls for anyway: *"a
principle that over many runs never appears in a single hand-over note is either
superfluous or unclearly worded."*

**The formulating does not work.** And the reason is not caution but structure. It
follows immediately from the direction in 3.5.

#### The error is already in the name

A principle that a system derives from its **observed errors** can only cover
cases that **have already occurred**. But the purpose of a principle is exactly
the reverse: to cover the **family**, including the members nobody has yet seen
(3.5, Kaplow).

> **A "principle" derived from incidents is a rule in the dress of a principle.**
> It carries the generality in its wording and the narrowness in its origin.

In the terms of 3.5: what would arise here is a **rule-based principle**, and the
right form of construction is the reverse, the **principle-based rule**.

The error has a name, and it stands in 3.5: **the direction of origin is taken for
the direction of justification.** Whoever derives principles directly from
incidents skips the question of what for. And that is not hair-splitting: such a
sentence looks like a principle, is filed as one, and leaves open the gap a real
principle would have closed. **It is worse than either.** It has neither the
checkability of the rule nor the reach of the principle.

The leap from the single case to the family is an **act of abstraction**, not a
counting result. From "on 20 August an estimated figure was reported as a
measurement" it does not follow mechanically that "a guessed figure sounds exactly
like a measured one". In between stands someone who recognises what the case is a
case of.

#### What the feedback loop is good for nonetheless

Not for writing, for **maintaining**. And for that it is worth a great deal,
because nobody else performs that maintenance (3.8):

| What the machine can report | What follows |
|---|---|
| Category X is accumulating | something is missing; **whether rule or principle, the human decides** |
| Principle Y appears in no hand-over | superfluous or unintelligible; look at it |
| Since the 8th principle the errors rise | **saturation** (3.4), measured instead of assumed |
| Rule Z is never triggered | out of date, the environment has moved (3.8) |
| Category X occurs in arm G, not in R | a candidate for a **rule**, not for a principle |

The last line is the most useful: **the feedback loop can propose which channel
something belongs in**, by looking at which arm did not have the error. That is a
decision aid that comes from data and not from a feeling.

#### The bolt that stays in place

A system that rewrites its own steering is exactly what this paper warns against:
a check that agrees with itself, one level up. So the rule that holds in the
network anyway stays:

> **Outward only as a proposal.** What the feedback loop finds is **put forward**,
> not installed. The human decides whether it becomes a rule or a principle, how
> it reads, and whether another has to give way for it.

That is not a brake born of mistrust. It is the place where the act of abstraction
happens, and that can only happen where someone knows what the case is a case of.

#### A fourth arm that tests the thesis once more

The feedback loop can be measured rather than believed. It yields a further arm:

**R+G+F**. Like R+G, but after every ten runs the system puts its findings
forward, and a human decides on an addition.

The prediction that follows, and that can be wrong:

> **The fourth arm improves for task type B** (improve what exists, recurring
> cases) **and not for type E** (own idea, new cases).

If that holds, the thesis from 3.5 is confirmed: what one derives from incidents
works like a rule. It helps where the case recurs, and not where it is new. If
type E improves as well, the distinction between derived and set principles was
drawn too sharply, and this section is to be discarded.

---

## 8 · Placing the work

The observation at issue has a form that appears elsewhere in this work too: **it
goes in both directions.**

The human shapes the AI: through rules he enforces, and through principles he
passes on. And the AI shapes the human: through habituation, through relief,
through disappointment. Whoever looks at only one direction describes half of it.

The same figure carries the SBKIM protocol, alongside which the setup arose: a
search in which **both sides ask and both answer**, without a central index and
without a hierarchy between seeker and sought. There the symmetry of direction is
a technical decision. Here it is an observation. Whether that is more than an
analogy is open. It is named here and not claimed.

The second direction, what the use does to the human, is the subject of a separate
paper and expressly **not** treated in this one.

---

## 9 · Availability

Material, rules, principles and the detailed findings together with their limits
lie open under the MIT licence:

<https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

- `WERKSTATTREGELN.md`, the six rules verbatim
- `grundsaetze.md`, the five principles, a byte-identical copy of the running state
- `BEFUND.md`, the detailed findings and the limits
- `README.md`, provenance and checksums

The running system itself is not public. The reason is not one of substance: its
version history contains the operator's invoice data, and an open licence would be
an invitation to reproduce it permanently. The research components are therefore
provided as a dated snapshot with checksums; the repository stays closed. **That
too is a finding**, if an involuntary one: `git rm` removes a file from the
working state, not from the past.

---

## References

**Bai, Y. et al. (2022).** *Constitutional AI: Harmlessness from AI Feedback.*
arXiv:2212.08073.

**Gneezy, U., Rustichini, A. (2000).** *A Fine is a Price.* Journal of Legal
Studies 29(1), 1–17.

**Kant, I. (1785).** *Grundlegung zur Metaphysik der Sitten*, on the distinction
between legality and morality.

**Kaplow, L. (1992).** *Rules versus Standards: An Economic Analysis.* Duke Law
Journal 42(3), 557–629.

**Kohlberg, L. (1981).** *The Philosophy of Moral Development.* Harper & Row.
Stage model from the avoidance of punishment to self-chosen principles.

**Rebedea, T. et al. (2023).** *NeMo Guardrails: A Toolkit for Controllable and
Safe LLM Applications with Programmable Rails.* arXiv:2310.10501.

**Schuett, J., Anderljung, M., Carlier, A., Koessler, L., Garfinkel, B. (2024).**
*From Principles to Rules: A Regulatory Approach for Frontier AI.*
arXiv:2407.07300.

**Tyler, T. R. (1990).** *Why People Obey the Law.* Yale University Press
(reissued by Princeton University Press, 2006).

**On *specification gaming* and *reward hacking*:** DeepMind maintains a public
collection of over a hundred documented cases; the conceptual frame is Goodhart's
law ("when a measure becomes a target, it ceases to be a good measure").

---

## About the author

Not a computer scientist, not an academic. Since March 2026
working on the side on a network of openly licensed web applications and a
protocol for meaning-based search between independent web applications, **without
a central index and without infrastructure of its own at the user's end**; the
traffic runs over a borrowed relay. The setup described here was first a tool of
that work: it came about because it was needed, and only afterwards became the
subject, and was then deliberately extended into an experimental setup (3.0).

**What that is worth and what it is not:** the observations come from real tasks
over five months, with a running record instead of recollection. What is missing
is the method, and it is missing not through negligence but because it is not
there. For the experimental setup in section 7 a collaboration is expressly
sought.
