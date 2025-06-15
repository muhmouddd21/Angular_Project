import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { GetDataService } from '../../services/get-data.service';
import { fireStoreRestApi } from '../../firebaseUrl';

interface QuizGrade {
  id: number;
  quizName: string;
  level:String;
  topic: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: Date;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {

    email!:String;
    quizGrades:any=[];

  constructor(private authServ:AuthService,private quiz:GetDataService){};

    ngOnInit() {
      this.email = this.authServ.email;
      this.quiz.getRequest(fireStoreRestApi.concat(`${this.authServ.Uid}`), {
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${this.authServ.idtoken}`,
        },
      }).subscribe({
        next: (response:any) => {
          if(response){
            const arr =response.fields.quizzes.arrayValue.values;
            const extractedQuizDataWithFormattedDate = arr.map((quiz:any) => {
            const fields = quiz.mapValue.fields;
            return {
              topic: fields.topic.stringValue,
              level: fields.level.stringValue,
              quizTime: new Date(fields.quizTime.timestampValue).toLocaleString(),
              numberOfQuestions: Number(fields.questions.arrayValue.values.length),
              numberOfWrongAnswers: Number(fields.wrongAnswers.arrayValue.values.length)
            };

          });
          this.quizGrades =extractedQuizDataWithFormattedDate;

        }
      }
      })

  }



  // quizGrades: QuizGrade[] = [
  //   {
  //     id: 1,
  //     quizName: 'Introduction to Programming',
  //     subject: 'Computer Science',
  //     score: 85,
  //     maxScore: 100,
  //     percentage: 85,
  //     date: new Date('2024-01-15'),
  //     status: 'good'
  //   },
  //   {
  //     id: 2,
  //     quizName: 'Basic Mathematics',
  //     subject: 'Mathematics',
  //     score: 92,
  //     maxScore: 100,
  //     percentage: 92,
  //     date: new Date('2024-01-20'),
  //     status: 'excellent'
  //   },
  //   {
  //     id: 3,
  //     quizName: 'World History Quiz',
  //     subject: 'History',
  //     score: 78,
  //     maxScore: 100,
  //     percentage: 78,
  //     date: new Date('2024-01-25'),
  //     status: 'average'
  //   },
  //   {
  //     id: 4,
  //     quizName: 'English Grammar',
  //     subject: 'English',
  //     score: 88,
  //     maxScore: 100,
  //     percentage: 88,
  //     date: new Date('2024-02-01'),
  //     status: 'good'
  //   },
  //   {
  //     id: 5,
  //     quizName: 'Physics Fundamentals',
  //     subject: 'Physics',
  //     score: 95,
  //     maxScore: 100,
  //     percentage: 95,
  //     date: new Date('2024-02-05'),
  //     status: 'excellent'
  //   },
  //   {
  //     id: 6,
  //     quizName: 'Chemistry Basics',
  //     subject: 'Chemistry',
  //     score: 72,
  //     maxScore: 100,
  //     percentage: 72,
  //     date: new Date('2024-02-10'),
  //     status: 'average'
  //   },
  //   {
  //     id: 7,
  //     quizName: 'Biology Test',
  //     subject: 'Biology',
  //     score: 65,
  //     maxScore: 100,
  //     percentage: 65,
  //     date: new Date('2024-02-15'),
  //     status: 'poor'
  //   },
  //   {
  //     id: 8,
  //     quizName: 'Advanced Programming',
  //     subject: 'Computer Science',
  //     score: 90,
  //     maxScore: 100,
  //     percentage: 90,
  //     date: new Date('2024-02-20'),
  //     status: 'excellent'
  //   }
  // ];

  // averageScore: number = 0;
  // highestScore: number = 0;
  // passedQuizzes: number = 0;



  // private calculateStats() {
  //   const totalScore = this.quizGrades.reduce((sum, grade) => sum + grade.percentage, 0);
  //   this.averageScore = Math.round(totalScore / this.quizGrades.length);
  //   this.highestScore = Math.max(...this.quizGrades.map(grade => grade.percentage));
  //   this.passedQuizzes = this.quizGrades.filter(grade => grade.percentage >= 70).length;
  // }

  // private getGradeStatus(percentage: number): 'excellent' | 'good' | 'average' | 'poor' {
  //   if (percentage >= 90) return 'excellent';
  //   if (percentage >= 80) return 'good';
  //   if (percentage >= 70) return 'average';
  //   return 'poor';
  // }
}
