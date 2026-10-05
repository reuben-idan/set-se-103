const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, 'Reuben_AI_Mastering_the_Shell_with_GitHub_Copilot_CLI.pdf');
const imagePath = path.join(__dirname, 'copilot-cli-terminal.png');

const doc = new PDFDocument({ margin: 42, size: 'A4', layout: 'landscape' });
const stream = require('fs').createWriteStream(outputPath);
doc.pipe(stream);

doc.fontSize(20).text('Reuben_AI: Mastering the Shell with GitHub Copilot CLI', { align: 'center' });
doc.moveDown(0.8);
doc.fontSize(15).text('Copilot CLI terminal screenshot', { underline: true });
doc.moveDown(0.5);
doc.image(imagePath, { fit: [750, 410], align: 'center' });
doc.moveDown(0.5);
doc.fontSize(10).text(
  'The screenshot shows the complete Copilot CLI prompt and response, including the suggested commands and safety explanation.'
);

doc.addPage({ size: 'A4', layout: 'portrait', margin: 48 });
doc.fontSize(20).text('Git command and CLI follow-up');
doc.moveDown();
doc.fontSize(12).text('CLI prompt: “I committed locally but haven’t pushed yet. I want to combine the last two commits into a single commit with a new message. Use the git agent if available; otherwise explain the safest command and why.”');
doc.moveDown();
doc.fontSize(12).text(
  'This prompt gives the local/unpushed context, states the desired history change, names the preferred git agent, and requests a safety explanation. That specificity asks the CLI to address the real Git workflow rather than return a generic command.'
);
doc.moveDown();
doc.fontSize(12).text(
  'The terminal CLI reported that no git-named agent was available, so it adapted by using shell checks. It inspected the latest commits and branch status, found that main had only one commit and matched origin/main, and correctly warned that there were no two local commits to combine. It also noted the untracked assignment directory and said the proposed commands would leave it untouched.'
);
doc.moveDown();
doc.fontSize(14).text('Command for a branch with at least two local, unpushed commits', { underline: true });
doc.moveDown(0.5);
doc.font('Courier').fontSize(11).text('git branch backup-before-squash HEAD\ngit reset --soft HEAD~2\ngit commit -m "New commit message"');
doc.font('Helvetica').moveDown();
doc.fontSize(12).text(
  'The backup branch preserves the original tip. The soft reset then moves the current branch back two commits while keeping their combined changes staged, and the new commit records those changes under one message. These commands were not run: the current checkout did not meet the two-commit condition. A clean, verified worktree and the intended branch should be confirmed before applying them.'
);
doc.moveDown();
doc.fontSize(14).text('Accuracy ranking and justification', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(
  'Rating: 8/10. The CLI made this task more efficient by checking the actual branch and commit history before recommending a history rewrite; that prevented me from applying HEAD~2 to a checkout with only one commit. Its suggested sequence is appropriate for two local, unpushed commits, and the backup branch adds a recovery point. I did not give it 10/10 because the requested git agent was unavailable and the workflow could not be demonstrated on the intended two-commit history. If commits have already been pushed, rewriting shared history can disrupt collaborators and any force-push must be coordinated.'
);
doc.moveDown();
doc.fontSize(14).text('Comparison with git rebase -i', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(
  'An interactive rebase, such as git rebase -i HEAD~2, lets me choose squash or fixup and edit the combined message in the sequence editor. It is preferable when I need to reorder, drop, or selectively edit commits. The soft-reset approach is more direct when I simply want to combine exactly the last two commits under one new message.'
);
doc.end();

stream.on('finish', () => {
  console.log(`PDF created: ${outputPath}`);
});

stream.on('error', (err) => {
  console.error('Error writing PDF:', err);
  process.exitCode = 1;
});
