export type ResumeParseResult = {
  text: string;
  source: "pdf" | "docx";
};

export type ParsedResumeSection = {
  header: string;
  content: string;
};

export type ParsedResume = {
  name?: string;
  sections: ParsedResumeSection[];
};
