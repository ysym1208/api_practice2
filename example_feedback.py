import pandas as pd

def read_excel_data(file_path):
    df = pd.read_excel(file_path)
    scores = {}
    for index, row in df.iterrows():
        scores[row['Subject']] = row['Score']
    return scores

def generate_feedback(scores):
    # 여기에 Llama3 모델을 호출하여 피드백을 생성하는 로직을 추가
    feedback = f"Analyzing grades: {scores}"  # 예시 로직
    return feedback

if __name__ == '__main__':
    file_path = 'path_to_your_excel_file.xlsx'
    scores = read_excel_data(file_path)
    feedback = generate_feedback(scores)
    print(feedback)
