# script for sampling 10% of training images for watson vis-rec model

import os
import shutil
import random

rootdir = '/Users/ericabusch/Desktop/clothing_dataset/sorted_images'

directories = []
for entry in os.scandir(rootdir):
	if entry.is_dir():
		directories.append(entry.path)

for dir in directories:
	dirname = str(dir)
	print(dirname)
	imgs = [item for item in os.listdir(dir) if os.path.isfile(os.path.join(dir,item))]
	random.shuffle(imgs)
	n_sampled = int((len(imgs))*.1)
	sampled_imgs = imgs[0:n_sampled]
	os.mkdir(f'{dirname}_sampled')
	for img in sampled_imgs:
		shutil.copy(f'{dirname}/{img}',f'{dirname}_sampled')
	
