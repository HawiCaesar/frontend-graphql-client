FROM python:3.6

RUN mkdir /example

WORKDIR /example

RUN pip install --upgrade pip

COPY requirements.txt /example/requirements.txt

RUN pip install -r requirements.txt 

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
