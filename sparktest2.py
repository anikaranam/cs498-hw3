import findspark
findspark.init()

import pyspark
import sys

inputUrl = sys.argv[1]
outputUrl = sys.argv[2]

def mapFunc(x):
        return (len(x), 1)
def reduceFunc(v1, v2):
        return v1 + v2
sc = pyspark.SparkContext()
print('init')
lines = sc.textFile(inputUrl)
print(lines.count())
sentenceCounts = lines.map(mapFunc).reduceByKey(reduceFunc)
sentenceCounts.saveAsTextFile(outputUrl)
print('done')
