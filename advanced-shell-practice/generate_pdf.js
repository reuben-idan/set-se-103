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
  'The screenshot shows the Copilot CLI response. Its lower edge is cropped, so the final command is not visible.'
);

doc.addPage({ size: 'A4', layout: 'portrait', margin: 48 });
doc.fontSize(20).text('Git command and CLI follow-up');
doc.moveDown();
doc.fontSize(12).text('CLI prompt: “I committed locally but haven’t pushed yet. I want to combine the last two commits into a single commit with a new message. Use the git agent if available; otherwise explain the safest command and why.”');
doc.moveDown();
doc.fontSize(12).text(
  'I also tried the assignment prompt with GitHub Copilot CLI in a terminal. The CLI reported that no git-named agent was available. It checked the current repository and found only one commit, so it warned that HEAD~2 could not be used safely yet.'
);
doc.moveDown();
doc.fontSize(14).text('Command for a branch with at least two local, unpushed commits', { underline: true });
doc.moveDown(0.5);
doc.font('Courier').fontSize(11).text('git reset --soft HEAD~2\ngit commit -m "Your new commit message"');
doc.font('Helvetica').moveDown();
doc.fontSize(12).text(
  'The soft reset moves the current branch back two commits while keeping the combined changes staged. The new commit then records those changes under the replacement message. Check the current branch, commit history, and working tree first; do not run this when the required commits are not present.'
);
doc.moveDown();
doc.fontSize(14).text('Accuracy ranking and justification', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(
  'Rating: 8/10. The command is correct when the last two commits are local and unpushed, but the initial answer did not warn me to verify that condition or explain what changes if commits have already been pushed. Rewriting published history can disrupt collaborators and may require a carefully coordinated force-push, so it should not be done casually.'
);
doc.moveDown();
doc.fontSize(14).text('Comparison with git rebase -i', { underline: true });
doc.moveDown(0.5);
doc.fontSize(12).text(
  'An interactive rebase, such as git rebase -i HEAD~2, lets me choose squash or fixup and edit the combined commit message in the sequence editor. It is more flexible when I need to reorder, drop, or edit commits; the soft-reset approach is shorter when I simply want to combine the last two commits and create one new message.'
);
doc.end();

stream.on('finish', () => {
  console.log(`PDF created: ${outputPath}`);
});

stream.on('error', (err) => {
  console.error('Error writing PDF:', err);
  process.exitCode = 1;
});
