import json
from awslambda.udacity.loader import *

def main(event,context):
    fetch_records_udacity("info.txt")


