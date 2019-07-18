import sys
from sklearn.datasets import load_iris
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn import linear_model
import mysql.connector

DATASET_PATH = "/Users/michaelfilonenko/Downloads/dataset.csv"


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="successProjectDeveloper",
        passwd="Success1_",
        auth_plugin='mysql_native_password'
    )


def form_dataset(connection):

    cursor = connection.cursor()
    cursor.execute("use successProjectDatabase")

    # get project count from db
    query = ("select count(*) from Project")
    cursor.execute(query)
    row_count = cursor.fetchall()[0][0]
    print("row count {}", row_count)

    ids = np.zeros((row_count, ), dtype=int)

    # get project ids into the array
    query = "select * from Project"
    cursor.execute(query)

    i = 0
    for project in cursor:
        ids[i] = project[0]
        i += 1

    # print(ids)

    query = "select * from Project_Answers"
    cursor.execute(query)

    dataset = np.zeros((row_count, 3), dtype=np.float)
    answers_count = np.zeros((row_count, 3), dtype=np.int)

    tmp_connection = get_db_connection();
    tmp_cursor = tmp_connection.cursor()
    tmp_cursor.execute("use successProjectDatabase")

    for project_answer in cursor:

        project_id = project_answer[1]
        answer_id = project_answer[2]

        index = np.where(ids == project_id)[0][0]

        query = "select * from Answers where ID = {}".format(answer_id)
        tmp_cursor.execute(query)

        tmp_set = tmp_cursor.fetchall()[0]

        answer_value = tmp_set[1]
        question_id = int(tmp_set[2])

        if(question_id < 4) and answer_value != None:
            dataset[index][question_id - 1] += float(answer_value)
            answers_count[index][question_id - 1] += 1

        # print(project_id, ' ', answer_id)
        
    for i in range(dataset.shape[0]):
        for j in range(dataset.shape[1]):
            if answers_count[i,j] != 0:
                dataset[i,j] /= answers_count[i,j]

    print(dataset)

    # query = ("select * from Question")
    # cursor.execute(query)
    # questions = []
    # for (_, question) in cursor:
    #     questions.append(question)
    # print(questions)
    # dataset = np.zeros((row_count, 2), dtype=np.int)
    # print(dataset);

    # query = ("select count(*) from Answers")
    # cursor.execute(query)
    # answers_count = cursor.fetchall()[0][0]
    # answers = np.zeros((answers_count, 2), dtype=np.int16)

    # query = ("select * from Answers")
    # cursor.execute(query)
    # for (id, answer, question_id) in cursor:
    #     question_id = float(str(question_id))
    #     answer = str(answer)
    #     if answer == 'None':
    #         answer = -1
    #     else:
    #         answer = float(answer)
    #     answers[id - 1, 0] = question_id
    #     answers[id - 1, 1] = answer

    # query = ("select * from Project_Answers")
    # cursor.execute(query)
    # for (_, project_id, answer_id, _, _) in cursor:
    #     project_id = int(str(project_id))
    #     answer_id = int(str(answer_id))

    #     dataset[project_id - 1, answers[answer_id - 1][0] - 1] = answers[answer_id - 1][1];

    cursor.close()
    connection.close()

    tmp_cursor.close()
    tmp_connection.close()

    # train = dataset[dataset[:,3] != 0]
    # test = dataset[dataset[:,3] == 0]

    train = pd.DataFrame.from_records(dataset, columns=["Impact", "Complexity", "Improvement"])

    return (["Impact", "Complexity", "Improvement"], train)
    # print(train)
    # test = pd.DataFrame.from_records(test, columns=["Impact", "Complexity", "Improvement", "Implementation"])
    # return (questions, train, test)


def process_dataset(questions, dataset):
    X = dataset[questions[:len(questions) - 1]]
    Y = dataset[questions[-1]]
    regr = linear_model.LinearRegression()
    regr.fit(X, Y)
    return regr


def main():
    ds = form_dataset(get_db_connection())
    regr = process_dataset(ds[0], ds[1])
    # print('Intercept: \n', regr.intercept_)
    # print('Coefficients: \n', regr.coef_)
    # for row in range(ds[2].shape[0]):
    #     prediction = regr.predict([ds[2][row, :ds[2].shape[1] - 1]])
        # print("Prediction: {}", prediction)

    print(regr.predict([(10, 10)]))
    while True:
        line = sys.stdin.readline()

        line = line[:-1]

        split = [float(s) for s in line.split(' ')]

        prediction = regr.predict([split])
        print(prediction[0])


if __name__ == "__main__":
    main()
