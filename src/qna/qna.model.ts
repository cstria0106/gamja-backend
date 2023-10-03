export type Qna = {
  id: string;
  userId: string;
  question: string;
  answer: string | null;
  createdAt: Date;
  answeredAt: Date | null;
};

export module Qna {
  export type Criteria = Pick<Qna, 'id'>;
  export module Variant {
    export type Answered = Pick<Qna, 'id' | 'question' | 'createdAt'> & {
      answer: string;
      answeredAt: Date;
    };

    export type NotAnswered = Pick<Qna, 'id' | 'question' | 'createdAt'> & {
      answer: null;
      answeredAt: null;
    };
  }
  export module View {
    export type Answered = Qna.Variant.Answered;
    export type NotAnswered = Qna.Variant.NotAnswered;
  }
}
