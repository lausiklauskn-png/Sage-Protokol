# Rules and Principles

## Two ways to steer an AI system, and why neither is enough on its own

**A field observation on a running multi-role system**

Klaus Nitzsche · Hamburg · Version 1, 2026-08-23
Licence: CC BY 4.0 · Code and material: MIT
Material: <https://github.com/lausiklauskn-png/Sage-Protokol/tree/main/docs/werkstatt>

---

> ⚠ **UNFINISHED TRANSLATION — DO NOT PUBLISH.**
> This file carries sections 1 to 3.4 of the German original
> [`PAPER_A_regeln-und-grundsaetze.md`](PAPER_A_regeln-und-grundsaetze.md).
> Sections 3.5 to 9, the bibliography and the note on the author are **not yet
> translated**. The German version is the source and is still being revised;
> where the two differ, the German one is authoritative.
> Status 2026-09-03.

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
